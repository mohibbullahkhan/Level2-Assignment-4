import express from "express";
import { PaymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

// Webhook must be raw body, so we will handle the middleware in app.ts specifically for this route
router.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhook);

router.post("/create", auth(Role.TENANT), PaymentController.createPaymentSession);
router.get("/", auth(Role.TENANT), PaymentController.getTenantPayments);
router.get("/:id", auth(Role.TENANT, Role.ADMIN), PaymentController.getPaymentById);

export const PaymentRoutes = router;
