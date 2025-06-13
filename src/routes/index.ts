import { Router } from "express";
import users from "./users.route";
import problems from "./problems.route";
import sessions from "./sessions.route";
import prompt from "./prompt.route";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use("/users", users);
router.use("/problems", authorize, problems);
router.use("/sessions", authorize, sessions);
router.use("/prompt", authorize, prompt);

export default router;
