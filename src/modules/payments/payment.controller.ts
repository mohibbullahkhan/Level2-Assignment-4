import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.createPaymentSession(req.user.id, req.body.rentalRequestId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment session created successfully",
    data: result
  });
});

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  const result = await PaymentService.handleStripeWebhook(req.body, signature);
  res.status(200).json(result);
});

const getTenantPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getTenantPayments(req.user.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payments retrieved successfully",
    data: result
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getPaymentById(req.params.id as string, req.user.id, req.user.role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieved successfully",
    data: result
  });
});

export const PaymentController = {
  createPaymentSession,
  handleStripeWebhook,
  getTenantPayments,
  getPaymentById
};
