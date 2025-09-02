import { ChatOpenAI } from "@langchain/openai";
import { fetchGptKey } from "./fetchGptKey";
import { getItemFromDB, updateItemInDB } from "../../utils/commonDynamodbMethods";
import { PROMPTS_TABLE, USERS_TABLE } from "../../utils/constants";
// import { isMessageContentComplex } from "@langchain/core/messages";
import { countTokens } from "../../utils/tokenCounter";

// Helper to flatten MessageContentComplex[] to string (if needed)
function flattenContent(content: any): string {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part.text === "string" ? part.text : ""))
      .join("");
  }

  return "";
}

export async function getGptResponse(
  promptKey: string,
  actor: string,
  context: string,
  modelType: string,
  userId: string
): Promise<string> {

  const apiKey = await fetchGptKey();

  const llm = new ChatOpenAI({
    openAIApiKey: apiKey,
    temperature: 0.7,
    modelName: modelType,
  });

  const params = {
    TableName: PROMPTS_TABLE,
    Key: {
      id: promptKey
    }
  }

  const prompt = await getItemFromDB(params);

  if (!prompt) {
    throw new Error("Problem not found");
  }

  const finalPrompt = `
    You are acting as a: ${actor}

    Context: ${prompt.prompt.replace("{context}", context)}

    Given the context, this is your task: ${prompt.prompt}
    `.trim();

  const inputTokens = countTokens(finalPrompt, modelType);

  const res = await llm.invoke(finalPrompt);
  // Normalize content
  const content = flattenContent(res.content);

  const outputTokens = countTokens(content, modelType);

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

  return content;
}
