import express from "express";
import { RentalController } from "./rental.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRentalSchema, updateRentalStatusSchema } from "./rental.validation";
import { auth } from "../../middlewares/auth";
import { Role } from "@prisma/client";

const tenantRouter = express.Router();
const landlordRouter = express.Router();

tenantRouter.post("/", auth(Role.TENANT), validateRequest(createRentalSchema), RentalController.createRentalRequest);
tenantRouter.get("/", auth(Role.TENANT), RentalController.getTenantRequests);
tenantRouter.get("/:id", auth(Role.TENANT, Role.ADMIN), RentalController.getRentalById);

landlordRouter.get("/", auth(Role.LANDLORD), RentalController.getLandlordRequests);
landlordRouter.patch("/:id", auth(Role.LANDLORD), validateRequest(updateRentalStatusSchema), RentalController.updateRentalStatus);

export const RentalRoutes = tenantRouter;
export const LandlordRentalRoutes = landlordRouter;
