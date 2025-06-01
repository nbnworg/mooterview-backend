import { Router } from "express";
import { signupUser } from "../services/users/signupUser";
import { loginUser } from "../services/users/loginUser";
import { CreateUserInput, CreateUserOutput } from "mooterview-server";

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
      res.status(400).json({ message: "Missing Required Fields" });
    }
    const result: CreateUserOutput = await signupUser(input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(`Error login as admin: ${error}`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(`Error login as admin: ${error}`);
  }
});

export default router;
