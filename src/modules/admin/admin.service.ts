import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { UserStatus } from "@prisma/client";

const getUsers = async (role?: string) => {
  const filter: any = {};
  if (role) filter.role = role;
  
  return await prisma.user.findMany({
    where: filter,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true
    }
  });
};

const updateUserStatus = async (id: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, "User not found");

  if (user.role === "ADMIN") {
    throw new AppError(403, "Cannot change status of an admin");
  }

  return await prisma.user.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true
    }
  });
};

const getProperties = async () => {
  return await prisma.property.findMany({
    include: {
      category: true,
      landlord: { select: { id: true, name: true, email: true } }
    }
  });
};

const getRentals = async () => {
  return await prisma.rentalRequest.findMany({
    include: {
      property: true,
      tenant: { select: { id: true, name: true, email: true } }
    }
  });
};

export const AdminService = {
  getUsers,
  updateUserStatus,
  getProperties,
  getRentals,
};
