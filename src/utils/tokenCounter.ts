// utils/tokenCounter.ts
import { encoding_for_model, TiktokenModel } from "tiktoken";

const encoders = new Map<string, any>();

export const countTokens = (text: string, modelName: string): number => {
  let normalizedModel: TiktokenModel;
  

  if (modelName.toLowerCase().includes("gpt-4o")) {
    normalizedModel = "gpt-3.5-turbo"; // GPT-4o uses the same tokenizer as GPT-3.5
  } else if (modelName.toLowerCase().includes("gpt-4")) {
    normalizedModel = "gpt-4";
  } else {
    normalizedModel = "gpt-3.5-turbo";
  }
  
  if (!encoders.has(normalizedModel)) {
    encoders.set(normalizedModel, encoding_for_model(normalizedModel));
  }
  
  const encoder = encoders.get(normalizedModel);
  return encoder.encode(text).length;
};