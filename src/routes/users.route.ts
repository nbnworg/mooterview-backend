import { Router } from "express";
import { signupUser } from "../services/users/signupUser";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { username, email, password, fullName, location } = req.body;
    if (!username || !email || !password || !fullName || !location) {
      res.status(400).json({ message: "Missing Required Fields" });
    }
    const result = await signupUser(
      username,
      email,
      password,
      fullName,
      location
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(`Error login as admin: ${error}`);
  }
});

router.post("/");

export default router;
