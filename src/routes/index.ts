import { Router } from "express";
import users from "./users.route";
import problems from "./problems.route";
import sessions from "./sessions.route";

const router = Router();

router.use("/users", users);
router.use("/problems", problems);
router.use("/sessions", sessions);

export default router;
