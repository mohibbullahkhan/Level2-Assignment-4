import express from "express";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserStatusSchema } from "./admin.validation";
import { auth } from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.use(auth(Role.ADMIN));

router.get("/users", AdminController.getUsers);
router.patch("/users/:id", validateRequest(updateUserStatusSchema), AdminController.updateUserStatus);
router.get("/properties", AdminController.getProperties);
router.get("/rentals", AdminController.getRentals);

export const AdminRoutes = router;
