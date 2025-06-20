import { Router } from "express";
import users from "./users.route";
import problems from "./problems.route";
import sessions from "./sessions.route";
import prompt from "./prompt.route";
import refresh from "./refresh.route";
import { authorizer } from "../middleware/authorizer";

const router = Router();

router.use("/users", users);
router.use("/problems", authorizer, problems);
router.use("/sessions", authorizer, sessions);
router.use("/prompt", authorizer, prompt);
router.use("/auth", refresh);

export default router;
