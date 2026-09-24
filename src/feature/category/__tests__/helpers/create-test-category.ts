import { seedCategory } from "@/shared/seeder/category.seed";

export async function createTestCategory(): Promise<string> {
  const category = await seedCategory(1);

  if (!category[0]?.id!) throw new Error("Failed to create category");
  
  return category[0].id;
}