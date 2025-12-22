import type { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

interface JwtPayload {
  userId: string;
  role: string;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect =
  (roles: string[] = []) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      const extractedId = decoded.userId;
      const extractedRole = decoded.role;

      if (!extractedId) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      req.user = {
        userId: extractedId,
        role: extractedRole,
      };

      if (roles.length && !roles.includes(extractedRole)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      console.error("Auth Middleware Error:", err);
      res.status(401).json({ message: "Unauthorized" });
    }
  };
