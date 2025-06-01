import { Router } from "express";
import { CreateProblemInput, CreateProblemOutput } from "mooterview-server";
import { createProblem } from "../services/problems/createProblem";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const input: CreateProblemInput = {
      title: req.body.title,
      problemStatement: req.body.problemStatement,
      problemDescription: req.body.problemDescription,
      level: req.body.level,
      averageSolveTime: req.body.averageSolveTime,
      totalUsersAttempted: req.body.totalUsersAttempted,
    };
    if (!input) {
      res.status(400).json({ message: "Missing Required Fields" });
    }

    const result: CreateProblemOutput = await createProblem(input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: `Error while creating problem: ${error}` });
  }
});

router.get("/", async (req, res) => {});

router.get("/:problemId", async (req, res) => {});

export default router;
