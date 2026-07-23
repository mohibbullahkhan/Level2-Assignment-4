import express from "express";
import { CategoryController } from "./category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategorySchema, updateCategorySchema } from "./category.validation";
import { auth } from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.get("/", CategoryController.getCategories);
router.post("/", auth(Role.ADMIN), validateRequest(createCategorySchema), CategoryController.createCategory);
router.put("/:id", auth(Role.ADMIN), validateRequest(updateCategorySchema), CategoryController.updateCategory);
router.delete("/:id", auth(Role.ADMIN), CategoryController.deleteCategory);

export const CategoryRoutes = router;
