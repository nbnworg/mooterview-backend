import { Router } from "express";
import { signupUser } from "../services/users/signupUser";
import { loginUser } from "../services/users/loginUser";
import {
  CreateUserInput,
  CreateUserOutput,
  GetSessionsForProblemsByUserInput,
  GetSessionsForProblemsByUserOutput,
  GetSessionsForUserInput,
  GetSessionsForUserOutput,
  GetUserByIdInput,
  GetUserByIdOutput,
} from "mooterview-server";
import { getUserById } from "../services/users/getUserById";
import { handleValidationErrors } from "../utils/handleValidationError";
import { getSessionForUser } from "../services/users/getSessionForUser";
import { getSessionsForProblemsByUser } from "../services/users/getSessionsForProblemsByUser";
import { authorize } from "../middleware/authorize";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const input: CreateUserInput = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.fullName,
      location: req.body.location,
    };

    const validationOutput = CreateUserInput.validate(input);
    handleValidationErrors(validationOutput);
    const result: CreateUserOutput = await signupUser(input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(`Error while signup: ${error}`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Missing required fields: email or password" });
    }
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(`Error while login: ${error}`);
  }
});

router.get("/:userId", authorize, async (req, res) => {
  try {
    const input: GetUserByIdInput = {
      userId: req.params.userId,
    };

    const validationOutput = GetUserByIdInput.validate(input);
    handleValidationErrors(validationOutput);

    const userProfile: GetUserByIdOutput = await getUserById(input);

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).send(`Error fetching user details: ${error}`);
  }
});

router.get("/:userId/sessions", authorize, async (req, res) => {
  try {
    const input: GetSessionsForUserInput = {
      userId: req.params.userId,
    };

    if (!input.userId) {
      throw new Error("Failed to read userId from Params");
    }

    const sessions: GetSessionsForUserOutput = await getSessionForUser(input);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).send(`Error fetching session for the user: ${error}`);
  }
});

router.get("/:userId/problems/:problemId/sessions", authorize, async (req, res) => {
  try {
    const input: GetSessionsForProblemsByUserInput = {
      userId: req.params.userId,
      problemId: req.params.problemId,
    };

    if (!input) {
      throw new Error("Failed to read userId or sessionId from params");
    }

    const sessions: GetSessionsForProblemsByUserOutput =
      await getSessionsForProblemsByUser(input);
    res.status(200).json(sessions);
  } catch (error) {
    res
      .status(500)
      .send(`Error fetching sessions for a user for a specific problem`);
  }
});

export default router;
