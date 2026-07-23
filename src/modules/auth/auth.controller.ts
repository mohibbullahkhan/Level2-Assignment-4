import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  const { refreshToken, accessToken, user } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.env === "production",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.env === "production",
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken
    }
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.env === "production",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.env === "production",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      refreshToken
    }
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: config.env === "production",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Access token retrieved successfully",
    data: result
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getMe(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile retrieved successfully",
    data: result
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
  getMe,
};
