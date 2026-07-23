import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError";
import config from "../config";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorDetails: any = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid input data";
    errorDetails = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 400;
      message = "Duplicate entry — this value already exists";
      errorDetails = err;
    } else if (err.code === "P2003") {
      statusCode = 400;
      message = "Related record not found";
      errorDetails = err;
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Requested record was not found";
      errorDetails = err;
    }
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errorDetails = {
      issues: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    };
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err;
  } else if (err instanceof Error) {
    message = err.message;
    errorDetails = err;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: config.env === "development" ? {
      ...errorDetails,
      stack: err?.stack,
    } : errorDetails,
  });
};
