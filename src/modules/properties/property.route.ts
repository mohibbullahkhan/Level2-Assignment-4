import express from "express";
import { PropertyController } from "./property.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createPropertySchema, updatePropertySchema } from "./property.validation";
import { auth } from "../../middlewares/auth";
import { optionalAuth } from "../../middlewares/optionalAuth";
import { Role } from "@prisma/client";

const router = express.Router();
const landlordRouter = express.Router();

router.get("/", optionalAuth(), PropertyController.getProperties);
router.get("/:id", PropertyController.getPropertyById);

landlordRouter.post("/", auth(Role.LANDLORD), validateRequest(createPropertySchema), PropertyController.createProperty);
landlordRouter.put("/:id", auth(Role.LANDLORD), validateRequest(updatePropertySchema), PropertyController.updateProperty);
landlordRouter.delete("/:id", auth(Role.LANDLORD), PropertyController.deleteProperty);

export const PropertyRoutes = router;
export const LandlordPropertyRoutes = landlordRouter;
