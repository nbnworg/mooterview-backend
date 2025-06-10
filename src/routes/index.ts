import { Router } from "express";
import users from "./users.route";
import problems from "./problems.route";
import sessions from "./sessions.route";
import prompt from "./prompt.route";

const router = Router();

router.use("/users", users);
router.use("/problems", problems);
router.use("/sessions", sessions);
router.use("/prompt", prompt);

export default router;
