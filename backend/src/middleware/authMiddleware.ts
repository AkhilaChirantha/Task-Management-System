import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import User from "../models/User";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  try {
    // Verify the token and get the decoded payload
    const decoded = verifyToken(token) as { userId: string; role: string; name: string };

    // Fetch the user from the database using the userId from the token
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Attach the user object (including avatar) to the request
    (req as any).user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar, // Ensure avatar is included
    };

    next(); // Continue to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};