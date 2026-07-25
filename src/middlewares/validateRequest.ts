import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

export type ValidationFunction = (data: any) => { isValid: boolean; errors: any[] };

export const validateRequest = (validator: ValidationFunction) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = validator({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errorDetails: {
          issues: result.errors
        }
      });
    }

    next();
  });
};
