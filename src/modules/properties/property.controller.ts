import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PropertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";

const getProperties = catchAsync(async (req: Request, res: Response) => {
  const userRole = req.user?.role;
  const userId = req.user?.id;
  const result = await PropertyService.getProperties(req.query, userRole, userId);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Properties retrieved successfully",
    data: result.properties,
    meta: result.meta
  });
});

const getPropertyById = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.getPropertyById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property retrieved successfully",
    data: result
  });
});

const createProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.createProperty(req.user.id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Property created successfully",
    data: result
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.updateProperty(req.params.id, req.user.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property updated successfully",
    data: result
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.deleteProperty(req.params.id, req.user.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property deleted successfully",
    data: result
  });
});

export const PropertyController = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
