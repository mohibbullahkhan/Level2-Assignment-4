import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RentalService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.createRentalRequest(req.user.id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Rental request submitted successfully",
    data: result
  });
});

const getTenantRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.getTenantRequests(req.user.id, req.query.status as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rental requests retrieved successfully",
    data: result
  });
});

const getRentalById = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.getRentalById(req.params.id as string, req.user.id, req.user.role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rental request retrieved successfully",
    data: result
  });
});

const getLandlordRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.getLandlordRequests(req.user.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rental requests retrieved successfully",
    data: result
  });
});

const updateRentalStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.updateRentalStatus(req.params.id as string, req.user.id, req.body.status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rental status updated successfully",
    data: result
  });
});

export const RentalController = {
  createRentalRequest,
  getTenantRequests,
  getRentalById,
  getLandlordRequests,
  updateRentalStatus,
};
