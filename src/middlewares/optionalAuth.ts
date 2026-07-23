import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { Role } from "@prisma/client";
import { catchAsync } from "../utils/catchAsync";

export const optionalAuth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          config.jwt.accessSecret
        ) as JwtPayload;
        req.user = decoded as JwtPayload & { role: Role; id: string; email: string };
      } catch (err) {
        // Ignore invalid token for optional auth
      }
    }

    next();
  });
};
