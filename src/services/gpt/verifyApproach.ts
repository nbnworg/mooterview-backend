import { ChatOpenAI } from "@langchain/openai";
import { fetchGptKey } from "./fetchGptKey";
import { updateItemInDB } from "../../utils/commonDynamodbMethods";
import { USERS_TABLE } from "../../utils/constants";
import { countTokens } from "../../utils/tokenCounter";

export const verifyApproach = async (approach: string, code: string, problemTitle: string, userId: string) => {
  const apiKey = await fetchGptKey();
  const llm = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: "gpt-4o",
    modelKwargs: { response_format: { type: "json_object" } },
  });

  const directComparisonPrompt = `
    You are a meticulous Senior Software Engineer conducting a coding interview. Your primary goal is to verify if the candidate's CODE is a faithful implementation of their stated APPROACH for the problem: "${problemTitle}". You are not just checking for functional correctness, but for architectural and algorithmic alignment.
    USER'S DESCRIBED APPROACH:
    """
    ${approach}
    """
    USER'S SUBMITTED CODE:
    """
    ${code}
    """
    Follow these steps to make your determination:
    1.  **Deconstruct the APPROACH**: Identify the core algorithm (e.g., recursion, iteration, two-pointer), key data structures (e.g., hash map, heap, stack), and any mentioned time/space complexity goals.
    2.  **Deconstruct the CODE**: Analyze the implementation to identify the actual algorithm, data structures used, and the resulting time/space complexity.
    3.  **Compare and Contrast**: Directly compare your findings. Note any significant deviations. Did they propose an optimal solution but implement a brute-force one? Did they mention a specific data structure but fail to use it? Is the complexity different?
    4.  **Make a Final Decision**: Based on the comparison, decide if the implementation is a "MATCH" or a "MISMATCH". A strong conceptual and structural similarity is required for a "MATCH".
    5.  **Provide Feedback**:
        - If it is a "MISMATCH", provide a concise, helpful explanation of the primary deviation. Be encouraging but clear. DO NOT provide the correct code.
        - If it is a "MATCH", provide a brief, positive confirmation.
    Return your final output as a single JSON object with the following snake_case keys: "alignment_decision" (string: "MATCH" or "MISMATCH") and "feedback" (string).
  `;
  const inputTokens = countTokens(directComparisonPrompt, "gpt-4o");
  const response = await llm.invoke(directComparisonPrompt);
  const outputTokens = countTokens(response.content as string, "gpt-4o");

  // Update user token counts in DynamoDB 
  if (userId) {
    try {
      const updateParams = {
        TableName: USERS_TABLE,
        Key: { userId },
        UpdateExpression: "ADD totalInputTokens :it, totalOutputTokens :ot",
        ExpressionAttributeValues: {
          ":it": inputTokens,
          ":ot": outputTokens
        },
        ReturnValues: "ALL_NEW",
      };
      await updateItemInDB(updateParams);
    } catch (error) {
      console.error("Failed to update user token counts:", error);
    }
  }

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(response.content as string);
  } catch (err) {
    throw new Error(
      `Failed to parse LLM response as JSON. Response content: ${response.content}. Error: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  return {
    alignment: parsedResponse.alignment_decision,
    feedback: parsedResponse.feedback
  };
};