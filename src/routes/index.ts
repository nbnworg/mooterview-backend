import { Router } from "express";
import users from "./users.route";
import problems from "./problems.route";
import sessions from "./sessions.route";
import prompt from "./prompt.route";
import { verifyCognitoToken } from "../middleware/verifyCognitoToken";

const router = Router();

router.use("/users", users);
router.use("/problems", verifyCognitoToken, problems);
router.use("/sessions", verifyCognitoToken, sessions);
router.use("/prompt", prompt);

export default router;
