import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError";
import config from "../config";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  
  // Format errorDetails, stripping stack trace in production
  let errorDetails: any = { ...err };
  
  if (err instanceof Error) {
    errorDetails.name = err.name;
    errorDetails.message = err.message;
    if (config.env !== "production") {
      errorDetails.stack = err.stack;
    }
  }

  // Handle Prisma errors generically if needed
  if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = "Database operation failed";
    errorDetails.code = err.code;
    errorDetails.meta = err.meta;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails
  });
};
