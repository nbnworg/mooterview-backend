import { Router } from "express";
import {
  CreateProblemOutput,
  GetAllProblemsOutput,
  GetProblemByIdInput,
  GetProblemByIdOutput,
} from "mooterview-server";
import { createProblem } from "../services/problems/createProblem";
import { getProblemById } from "../services/problems/getProblemById";
import { getProblems } from "../services/problems/getProblems";
import { handleValidationErrors } from "../utils/handleValidationError";

const router = Router();

export interface CreateProblemInputType {
  title: string;
  problemStatement: string;
  problemDescription: string;
  level: string;
  averageSolveTime: string | number;
  totalUsersAttempted: string | number;
}

router.post("/", async (req, res) => {
  try {
    const input: CreateProblemInputType = {
      title: req.body.title,
      problemStatement: req.body.problemStatement,
      problemDescription: req.body.problemDescription,
      level: req.body.level,
      averageSolveTime: req.body.averageSolveTime,
      totalUsersAttempted: req.body.totalUsersAttempted,
    };

    const result: CreateProblemOutput = await createProblem(input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: `Error while creating problem: ${error}` });
  }
});

router.get("/", async (req, res) => {
  try {
    const problems: GetAllProblemsOutput = await getProblems();
    res.status(200).json(problems);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error while fetching problems: ${error}` });
  }
});

router.get("/:problemId", async (req, res) => {
  try {
    const input: GetProblemByIdInput = {
      problemId: req.params.problemId,
    };

    const validationOutput = GetProblemByIdInput.validate(input);
    handleValidationErrors(validationOutput);

    const problem: GetProblemByIdOutput = await getProblemById(input);

    res.status(200).json(problem);
  } catch (error) {
    res.status(500).send(`Error while fetching problem: ${error}`);
  }
});

export default router;
