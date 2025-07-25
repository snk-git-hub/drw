import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";


export function middleware(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "No or malformed token provided"
        });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        // @ts-ignore: TODO: Fix this
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}