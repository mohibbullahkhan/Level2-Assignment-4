import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

const createReview = async (tenantId: string, payload: any) => {
  const { rentalRequestId, rating, comment } = payload;

  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId }
  });

  if (!rentalRequest) throw new AppError(404, "Rental request not found");
  if (rentalRequest.tenantId !== tenantId) throw new AppError(403, "Forbidden");
  if (rentalRequest.status !== "COMPLETED") throw new AppError(400, "Rental is not COMPLETED yet");

  return await prisma.review.create({
    data: {
      tenantId,
      propertyId: rentalRequest.propertyId,
      rentalRequestId,
      rating,
      comment
    }
  });
};

export const ReviewService = {
  createReview,
};
