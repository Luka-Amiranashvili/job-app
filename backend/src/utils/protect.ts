import type { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

interface JwtPayload {
  id?: string;
  userId: string;
  role: string;
}

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const extractedId = decoded.userId || decoded.id;

      if (!extractedId) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      req.user = {
        userId: extractedId,
        role: decoded.role,
      };

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Unauthorized" });
    }
  };
