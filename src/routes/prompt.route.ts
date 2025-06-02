import { Router } from "express";
import { getGptResponse } from "../services/gpt/getGptResponse";

const router = Router();

router.post("/response", async (req, res) => {
  try {
    const { prompt, actor, context } = req.body;

    if (!prompt || !actor || !context) {
      res.status(400).json({ message: "Missing required fields: prompt, actor, or context" });
    }

    const result: any = await getGptResponse(prompt, actor, context);
    res.status(200).json({ response: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error getting response: ${error}` });
  }
});

export default router;