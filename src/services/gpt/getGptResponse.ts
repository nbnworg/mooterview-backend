import { ChatOpenAI } from "@langchain/openai";
import { fetchGptKey } from "./fetchGptKey";
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

export async function getGptResponse(prompt: string, actor: string, context: string): Promise<string> {
  const apiKey = await fetchGptKey();

  const llm = new ChatOpenAI({
    openAIApiKey: apiKey,
    temperature: 0.7,
    modelName: "gpt-3.5-turbo",
  });

  const finalPrompt = `
    You are acting as a: ${actor}

    Context: ${context}

    Given the context, this is your task: ${prompt}
    `.trim();

  const res = await llm.invoke(finalPrompt);

  // Normalize content
  const content = flattenContent(res.content);
  return content;
}
