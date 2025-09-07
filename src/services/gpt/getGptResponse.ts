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

const shouldResetTokens = (startDate: string | undefined): boolean => {
  if (!startDate) return true;

  const start = new Date(startDate);
  const now = new Date();
  
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 30;
};

export async function getGptResponse(
  promptKey: string,
  actor: string,
  context: string,
  modelType: string,
  userId?: string
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
    throw new Error(`Prompt with key "${promptKey}" not found in prompts table.`);
  }

  console.log('prompt', prompt);
  console.log('prompt.prompt', prompt.prompt)


  const finalPrompt = `
    You are acting as a: ${actor}

    ${prompt.prompt.replace("{context}", context)}
    `.trim();

  const inputTokens = countTokens(finalPrompt, modelType);

  const res = await llm.invoke(finalPrompt);
  // Normalize content
  const content = flattenContent(res.content);

  const outputTokens = countTokens(content, modelType);

  if (userId) {
    try {

      const userParams = {
        TableName: USERS_TABLE,
        Key: { userId }
      };

      const user = await getItemFromDB(userParams);
      const now = new Date().toISOString();

      let updateExpression: string;
      let expressionAttributeValues: any;

      if (shouldResetTokens(user?.tokenTrackingStartDate)) {
        updateExpression = `
          SET totalInputTokens = :it, 
              totalOutputTokens = :ot,
              tokenTrackingStartDate = :startDate
        `;
        
        expressionAttributeValues = {
          ":it": inputTokens,
          ":ot": outputTokens,
          ":startDate": now
        };
      } else {
        updateExpression = `
          ADD totalInputTokens :it, totalOutputTokens :ot
        `;
        
        expressionAttributeValues = {
          ":it": inputTokens,
          ":ot": outputTokens
        };
      }

      const updateParams = {
        TableName: USERS_TABLE,
        Key: { userId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      };

      await updateItemInDB(updateParams);
    } catch (error) {
      console.error("Failed to update user token counts:", error);
    }
  }

  return content;
}
