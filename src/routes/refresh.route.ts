import { Router } from "express";
import { refreshAccessToken } from "../utils/refreshToken";

const router = Router();

//@ts-ignore
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Missing refresh token" });
  }

  try {
    const tokens = await refreshAccessToken(refreshToken);
    return res.status(200).json(tokens);
  } catch (err: any) {
    console.error("Token refresh failed:", err.message);
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }
});

export default router;
