import { Router } from "express";
import { signupUser } from "../services/users/signupUser";
import { loginUser } from "../services/users/loginUser";
import {
  CreateUserInput,
  CreateUserOutput,
  GetUserByIdInput,
  GetUserByIdOutput,
} from "mooterview-server";
import { getUserById } from "../services/users/getUserById";
import { handleValidationErrors } from "../utils/handleValidationError";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const input: CreateUserInput = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.fullname,
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
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Missing required fields: username or password" });
    }
    const result = await loginUser(username, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(`Error while login: ${error}`);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const input: GetUserByIdInput = {
      userId: req.params.userId,
    };

    const validationOutput = GetUserByIdInput.validate(input);
    handleValidationErrors(validationOutput);

    const userProfile: GetUserByIdOutput = await getUserById(input);

    res.status(200).json(userProfile);
  } catch (error) {}
});

export default router;
