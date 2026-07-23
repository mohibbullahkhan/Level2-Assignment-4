import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { AppError } from "../utils/AppError";
import prisma from "../lib/prisma";
import { Role } from "@prisma/client";
import { catchAsync } from "../utils/catchAsync";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload & { role: Role; id: string; email: string };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(401, "You are not authorized!");
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt.accessSecret
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(401, "Invalid token");
    }

    const { role, id } = decoded;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(401, "User not found");
    }

    if (user.status === "BANNED") {
      throw new AppError(403, "User is banned");
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(role as Role)) {
      throw new AppError(403, "Forbidden access");
    }

    req.user = decoded as JwtPayload & { role: Role; id: string; email: string };
    next();
  });
};
