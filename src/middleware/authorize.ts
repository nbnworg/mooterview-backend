import { Request, Response, NextFunction } from "express";
import { cognito } from "../clients/clients";

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }
  const token = Array.isArray(header) ? header[0] : header;
  const accessToken = token.replace(/^Bearer /i, "");
  try {
    await cognito.getUser({ AccessToken: accessToken }).promise();
    next();
  } catch (error) {
    console.error("Authorization failed", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
