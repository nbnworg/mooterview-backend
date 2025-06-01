import { Router } from "express";
import users from "./users.route";
import problems from "./problems.route"

const router = Router();

router.use("/users", users);
router.use("/problems", problems)

export default router;
