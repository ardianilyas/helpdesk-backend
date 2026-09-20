import type { categories } from "@/shared/db/schemas";
import z from "zod";

export type Category = typeof categories.$inferSelect;

export const createCategoryDto = z.object({
  name: z.string().min(1, { error: "Name is required" }).min(3, { error: "Name must be at least 3 characters" }),
  description: z.string().min(1, { error: "Description is required" }).min(3, { error: "Description must be at least 3 characters" }),
});
export const updateCategoryDto = createCategoryDto.partial();
export const getCategoryDto = z.uuid({ error: "Invalid id format" });

export type CreateCategoryDto = z.infer<typeof createCategoryDto>;
export type UpdateCategoryDto = z.infer<typeof updateCategoryDto>;
export type GetCategoryDto = z.infer<typeof getCategoryDto>;
