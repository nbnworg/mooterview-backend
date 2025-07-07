import { ChatOpenAI } from "@langchain/openai";
import { fetchGptKey } from "./fetchGptKey";
import { getItemFromDB } from "../../utils/commonDynamodbMethods";
import { PROMPTS_TABLE } from "../../utils/constants";
// import { isMessageContentComplex } from "@langchain/core/messages";

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
  context: string
): Promise<string> {
  const apiKey = await fetchGptKey();

  if (promptKey === "needs-response") {
    return handleNeedsResponse(context);
  }

  const llm = new ChatOpenAI({
    openAIApiKey: apiKey,
    temperature: 0.7,
    modelName: "gpt-3.5-turbo",
  });

  const params = {
    TableName: PROMPTS_TABLE,
    Key: {
      id: promptKey,
    },
  };

  const prompt = await getItemFromDB(params);

  if (!prompt) {
    throw new Error("Problem not found");
  }

  console.log("prompt", prompt);
  console.log("prompt.prompt", prompt.prompt);

  const finalPrompt = `
    You are acting as a: ${actor}

    Context: ${prompt.prompt.replace("{context}", context)}

    Given the context, this is your task: ${prompt.prompt}
    `.trim();

  const res = await llm.invoke(finalPrompt);

  const content = flattenContent(res.content);
  return content;
}

async function handleNeedsResponse(context: string): Promise<string> {
  const apiKey = await fetchGptKey();

  const llm = new ChatOpenAI({
    openAIApiKey: apiKey,
    temperature: 0.2,
    modelName: "gpt-3.5-turbo",
  });

  const prompt = `
  Determine if this message requires a response. Answer ONLY "yes" or "no".

  Rules:
  - Respond "yes" for:
    * Direct questions
    * Requests for help
    * Unclear statements needing clarification
    * Technical concepts needing explanation
  - Respond "no" for:
    * Acknowledgments (ok, thanks, got it)
    * Thinking aloud (hmm, let me see)
    * Self-contained statements
    * Simple confirmations

  Examples:
  - "How do I implement this?" → "yes"
  - "I'm stuck on this part" → "yes"
  - "Thanks for the help" → "no"
  - "Let me think about this" → "no"
  - "I think I need a hashmap" → "no"

  Message: ${context}

  Answer:`.trim();

  const res = await llm.invoke(prompt);
  const content = flattenContent(res.content);

  return content.toLowerCase().startsWith("y") ? "yes" : "no";
}
