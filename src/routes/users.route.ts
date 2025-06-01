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
    if (!input) {
      throw new Error("Invalid Request, Missing Required Fields");
    }
    const result: CreateUserOutput = await signupUser(input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(`Error while signup: ${error}`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
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

    if (!input) {
      throw new Error("Invalid Request, Missing required fields");
    }

    const userProfile: GetUserByIdOutput = await getUserById(input);

    res.status(200).json(userProfile);
  } catch (error) {}
});

export default router;
