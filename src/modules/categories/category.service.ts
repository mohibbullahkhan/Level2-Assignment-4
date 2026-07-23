import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

const createCategory = async (payload: { name: string; description?: string }) => {
  return await prisma.category.create({
    data: payload
  });
};

const getCategories = async () => {
  return await prisma.category.findMany();
};

const updateCategory = async (id: string, payload: { name?: string; description?: string }) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Category not found");

  return await prisma.category.update({
    where: { id },
    data: payload
  });
};

const deleteCategory = async (id: string) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Category not found");

  return await prisma.category.delete({
    where: { id }
  });
};

export const CategoryService = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
