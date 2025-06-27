import { ChatOpenAI } from "@langchain/openai";
import { fetchGptKey } from "./fetchGptKey";
import { getItemFromDB } from "../../utils/commonDynamodbMethods";
import { PROMPTS_TABLE } from "../../utils/constants";
// import { isMessageContentComplex } from "@langchain/core/messages";

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

export async function getGptResponse(promptKey: string, actor: string, context: string): Promise<string> {
  const apiKey = await fetchGptKey();

  const llm = new ChatOpenAI({
    openAIApiKey: apiKey,
    temperature: 0.7,
    modelName: "gpt-3.5-turbo",
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

  console.log('prompt', prompt);
  console.log('prompt.prompt', prompt.prompt)

  const finalPrompt = `
    You are acting as a: ${actor}

    Context: ${prompt.prompt.replace("{context}", context)}

    Given the context, this is your task: ${prompt.prompt}
    `.trim();

  const res = await llm.invoke(finalPrompt);

  // Normalize content
  const content = flattenContent(res.content);
  return content;
}
