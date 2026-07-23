import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { RentalRequestStatus } from "@prisma/client";

const createRentalRequest = async (tenantId: string, payload: any) => {
  const { propertyId, moveInDate, message } = payload;

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) throw new AppError(404, "Property not found");
  if (property.status !== "AVAILABLE") throw new AppError(400, "Property is not available");

  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: { in: ["PENDING", "APPROVED"] }
    }
  });

  if (existingRequest) throw new AppError(400, "You already have a pending or approved request for this property");

  return await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId,
      moveInDate: new Date(moveInDate),
      message
    }
  });
};

const getTenantRequests = async (tenantId: string, status?: string) => {
  const filter: any = { tenantId };
  if (status) filter.status = status;

  return await prisma.rentalRequest.findMany({
    where: filter,
    include: { property: true }
  });
};

const getRentalById = async (id: string, userId: string, userRole: string) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      property: true,
      tenant: { select: { id: true, name: true, email: true, phone: true } }
    }
  });

  if (!request) throw new AppError(404, "Rental request not found");

  if (userRole === "TENANT" && request.tenantId !== userId) {
    throw new AppError(403, "Forbidden");
  }

  return request;
};

const getLandlordRequests = async (landlordId: string) => {
  return await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId
      }
    },
    include: {
      property: true,
      tenant: { select: { id: true, name: true, email: true, phone: true } }
    }
  });
};

const updateRentalStatus = async (id: string, landlordId: string, status: RentalRequestStatus) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id },
    include: { property: true }
  });

  if (!request) throw new AppError(404, "Rental request not found");
  if (request.property.landlordId !== landlordId) throw new AppError(403, "You do not own this property");

  return await prisma.rentalRequest.update({
    where: { id },
    data: { status }
  });
};

export const RentalService = {
  createRentalRequest,
  getTenantRequests,
  getRentalById,
  getLandlordRequests,
  updateRentalStatus,
};
