import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

const getProperties = async (query: any, userRole?: string, userId?: string) => {
  const { city, minPrice, maxPrice, categoryId, bedrooms, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filterConditions: Prisma.PropertyWhereInput = {};

  if (city) filterConditions.city = { contains: city as string, mode: "insensitive" };
  if (categoryId) filterConditions.categoryId = categoryId as string;
  if (bedrooms) filterConditions.bedrooms = Number(bedrooms);
  
  if (minPrice || maxPrice) {
    filterConditions.price = {};
    if (minPrice) filterConditions.price.gte = Number(minPrice);
    if (maxPrice) filterConditions.price.lte = Number(maxPrice);
  }

  // Only AVAILABLE unless caller is the owning landlord or an admin
  if (userRole !== "ADMIN") {
    if (userRole === "LANDLORD" && userId) {
      filterConditions.OR = [
        { status: "AVAILABLE" },
        { landlordId: userId }
      ];
    } else {
      filterConditions.status = "AVAILABLE";
    }
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: filterConditions,
      skip,
      take: Number(limit),
      include: {
        category: true,
      }
    }),
    prisma.property.count({ where: filterConditions })
  ]);

  return { properties, meta: { page: Number(page), limit: Number(limit), total } };
};

const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: { select: { name: true, id: true } },
      reviews: { select: { rating: true } }
    }
  });

  if (!property) throw new AppError(404, "Property not found");

  const averageRating = property.reviews.length
    ? property.reviews.reduce((acc, rev) => acc + rev.rating, 0) / property.reviews.length
    : 0;

  return {
    ...property,
    averageRating
  };
};

const createProperty = async (landlordId: string, payload: any) => {
  return await prisma.property.create({
    data: {
      ...payload,
      landlordId
    }
  });
};

const updateProperty = async (id: string, landlordId: string, payload: any) => {
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) throw new AppError(404, "Property not found");
  if (property.landlordId !== landlordId) throw new AppError(403, "You do not own this property");

  return await prisma.property.update({
    where: { id },
    data: payload
  });
};

const deleteProperty = async (id: string, landlordId: string) => {
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) throw new AppError(404, "Property not found");
  if (property.landlordId !== landlordId) throw new AppError(403, "You do not own this property");

  return await prisma.property.delete({
    where: { id }
  });
};

export const PropertyService = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
