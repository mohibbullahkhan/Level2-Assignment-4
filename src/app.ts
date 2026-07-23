import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";

import { AuthRoutes } from "./modules/auth/auth.route";
import { CategoryRoutes } from "./modules/categories/category.route";
import { PropertyRoutes, LandlordPropertyRoutes } from "./modules/properties/property.route";
import { RentalRoutes, LandlordRentalRoutes } from "./modules/rentals/rental.route";
import { PaymentRoutes } from "./modules/payments/payment.route";
import { ReviewRoutes } from "./modules/reviews/review.route";
import { AdminRoutes } from "./modules/admin/admin.route";

const app: Application = express();

// Stripe webhook must be parsed as raw body
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.use("/api/auth", AuthRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/properties", PropertyRoutes);
app.use("/api/landlord/properties", LandlordPropertyRoutes);
app.use("/api/rentals", RentalRoutes);
app.use("/api/landlord/requests", LandlordRentalRoutes);
app.use("/api/payments", PaymentRoutes);
app.use("/api/reviews", ReviewRoutes);
app.use("/api/admin", AdminRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to RentNest API!");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
