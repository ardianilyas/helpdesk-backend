import { db } from "@/shared/db";
import type { Category, CreateCategoryDto, UpdateCategoryDto } from "./category.dto";
import { categories } from "@/shared/db/schemas";
import { eq } from "drizzle-orm";

export class CategoryRepository {
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | null> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));

    return category ?? null;
  }

  async createCategory(data: CreateCategoryDto): Promise<Category | null> {
    const [category] = await db.insert(categories).values(data).returning();

    return category ?? null;
  }

  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category | null> {
    const [category] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();

    return category ?? null;
  }

  async deleteCategory(id: string): Promise<Category | null> {
    const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning();

    return deleted ?? null;
  }
}