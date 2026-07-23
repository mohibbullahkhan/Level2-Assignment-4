import { z } from "zod";
import { RentalRequestStatus } from "@prisma/client";

export const createRentalSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid("Invalid property ID"),
    moveInDate: z.string().refine((val) => new Date(val) > new Date(), {
      message: "Move in date must be a future date",
    }),
    message: z.string().optional(),
  }),
});

export const updateRentalStatusSchema = z.object({
  body: z.object({
    status: z.enum([RentalRequestStatus.APPROVED, RentalRequestStatus.REJECTED]),
  }),
});
