import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AdminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getUsers(req.query.role as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateUserStatus(req.params.id, req.body.status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User status updated successfully",
    data: result
  });
});

const getProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getProperties();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Properties retrieved successfully",
    data: result
  });
});

const getRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getRentals();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rentals retrieved successfully",
    data: result
  });
});

export const AdminController = {
  getUsers,
  updateUserStatus,
  getProperties,
  getRentals,
};
