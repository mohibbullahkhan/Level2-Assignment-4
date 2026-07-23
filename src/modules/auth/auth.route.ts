import express from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginSchema, registerSchema } from "./auth.validation";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), AuthController.registerUser);
router.post("/login", validateRequest(loginSchema), AuthController.loginUser);
router.post("/refresh-token", AuthController.refreshToken);
router.get("/me", auth(), AuthController.getMe);

export const AuthRoutes = router;
