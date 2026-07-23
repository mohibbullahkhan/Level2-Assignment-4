import { z } from "zod";

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    price: z.number().positive("Price must be a positive number"),
    bedrooms: z.number().int().nonnegative("Bedrooms must be non-negative integer"),
    bathrooms: z.number().int().nonnegative("Bathrooms must be non-negative integer"),
    area: z.number().positive("Area must be positive"),
    amenities: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    categoryId: z.string().uuid("Invalid category ID"),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    price: z.number().positive().optional(),
    bedrooms: z.number().int().nonnegative().optional(),
    bathrooms: z.number().int().nonnegative().optional(),
    area: z.number().positive().optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    categoryId: z.string().uuid().optional(),
  }),
});
