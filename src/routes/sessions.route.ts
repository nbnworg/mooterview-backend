import { Router } from "express";
import {
  CreateSessionOutput,
  DeleteSessionByIdInput,
  DeleteSessionByIdOutput,
  GetSessionByIdInput,
  GetSessionByIdOutput,
  UpdateSessionByIdInput,
  UpdateSessionByIdOutput,
} from "mooterview-server";
import { createSession } from "../services/sessions/createSession";
import { getSessionById } from "../services/sessions/getSessionById";
import { updateSessionById } from "../services/sessions/updateSessionById";
import { deleteSessionById } from "../services/sessions/deleteSessionById";

const router = Router();

export interface CreateSessionInputType {
  userId: string;
  problemId: string;
  // chatsQueue: [{ actor: string; message: string }];
  chatsQueue: [];
  startTime: string;
  endTime: string | undefined;
  problemStatus: string;
  // notes: [{ content: string; timestamp: string }];
  notes: [];
}
// @ts-ignore
router.post("/", async (req, res) => {
  try {
    console.log("req.body: ", req.body);

    console.log("here 1");

    const input: CreateSessionInputType = {
      userId: req.body.userId,
      problemId: req.body.problemId,
      chatsQueue: req.body.chatsQueue || [],
      startTime: req.body.startTime,
      endTime: req.body.endTime || "",
      problemStatus: req.body.problemStatus,
      notes: req.body.notes || [],
    };

    const requiredFields: (keyof CreateSessionInputType)[] = [
      "userId",
      "problemId",
      "chatsQueue",
      "startTime",
      "endTime",
      "problemStatus",
      "notes",
    ];

    const missingFields = requiredFields.filter(
      (field) => input[field] === undefined || input[field] === null
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    console.log("here 3");
    const result: CreateSessionOutput = await createSession(input);
    console.log("result session: ", result);
    console.log("here 4");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(`Error while creating session: ${error}`);
  }
});

router.get("/:sessionId", async (req, res) => {
  try {
    const input: GetSessionByIdInput = {
      sessionId: req.params.sessionId,
    };

    if (!input) {
      throw new Error("invalid Request, Missing Required Fields");
    }

    const session: GetSessionByIdOutput = await getSessionById(input);
    res.status(200).json(session);
  } catch (error) {
    res.status(500).send(`Error Fetching session: ${error}`);
  }
});

router.patch("/:sessionId", async (req, res) => {
  try {
    const input: UpdateSessionByIdInput = {
      sessionId: req.params.sessionId,
      chatsQueue: req.body.chatsQueue,
      endTime: req.body.endTime,
      problemStatus: req.body.problemStatus,
      notes: req.body.notes,
    };

    if (!input.sessionId) {
      throw new Error("Failed to read sessionId from Params");
    }

    const result: UpdateSessionByIdOutput = await updateSessionById(input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(`Error Updating session: ${error}`);
  }
});

router.delete("/:sessionId", async (req, res) => {
  try {
    const input: DeleteSessionByIdInput = {
      sessionId: req.params.sessionId,
    };

    const result: DeleteSessionByIdOutput = await deleteSessionById(input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(`Error while deleting session: ${error}`);
  }
});

export default router;
