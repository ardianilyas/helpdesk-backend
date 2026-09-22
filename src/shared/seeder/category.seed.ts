import type { CreateCategoryDto } from "@/feature/category/category.dto";
import { faker } from "@faker-js/faker";
import { db } from "@/shared/db";
import { categories } from "../db/schemas";

export async function seedCategory(length: number = 1) {
  const data: CreateCategoryDto[] = Array.from({ length }, (_, _index) => ({
    name: faker.word.adjective(),
    description: faker.lorem.sentence(),
  }));

  return db.insert(categories).values(data).returning();
}
