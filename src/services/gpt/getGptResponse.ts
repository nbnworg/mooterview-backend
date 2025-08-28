import { ChatOpenAI } from "@langchain/openai";
import { fetchGptKey } from "./fetchGptKey";
import { getItemFromDB } from "../../utils/commonDynamodbMethods";
import { PROMPTS_TABLE } from "../../utils/constants";

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

export async function getGptResponse(promptKey: string, actor: string, context: string, modelType: string): Promise<string> {
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

    console.log('finalPrompt', finalPrompt);

  const res = await llm.invoke(finalPrompt);

  // Normalize content
  const content = flattenContent(res.content);
  return content;
}
