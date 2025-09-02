import { Router } from "express";
import { getGptResponse } from "../services/gpt/getGptResponse";
import { verifyApproach } from "../services/gpt/verifyApproach";


const router = Router();

router.post("/response", async (req, res) => {
  try {
    const { promptKey, actor, context, modelName, userId } = req.body;

    if (!promptKey || !actor || !context) {
      res.status(400).json({ message: "Missing required fields: prompt, actor, or context" });
    }

    const result: any = await getGptResponse(promptKey, actor, context, modelName, userId);
    res.status(200).json({ response: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error getting response: ${error}` });
  }
});

router.post("/summarize", async (req, res) => {
  try {
    const { chatHistory } = req.body;
    if (!chatHistory) {
      return res.status(400).json({ message: "Missing chatHistory field" });
    }

    const summary = await getGptResponse(
      "summarize-conversation",
      "System",
      JSON.stringify(chatHistory),
      "gpt-4o"
    );

    res.status(200).json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error summarizing chat history" });
  }
});


router.post("/verify-approach", async (req, res) => {
  try {
    const { approach, code, problemTitle, userId } = req.body;
    if (
      typeof approach !== "string" || approach.trim() === "" ||
      typeof code !== "string" || code.trim() === "" ||
      typeof problemTitle !== "string" || problemTitle.trim() === ""
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const result = await verifyApproach(approach, code, problemTitle, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying approach" });
  }
});


export default router;