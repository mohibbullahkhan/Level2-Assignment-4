import express from "express";
import { ReviewController } from "./review.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createReviewSchema } from "./review.validation";
import { auth } from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/", auth(Role.TENANT), validateRequest(createReviewSchema), ReviewController.createReview);

export const ReviewRoutes = router;
