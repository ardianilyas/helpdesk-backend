import { NotFoundError } from "@/shared/errors/not-found";
import type { CategoryRepository } from "./category.repository";
import type { CreateCategoryDto, UpdateCategoryDto } from "./category.dto";

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getCategories() {
    return this.categoryRepository.getCategories();
  }

  async getCategory(id: string) {
    const category = await this.categoryRepository.getCategory(id);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }

  async createCategory(data: CreateCategoryDto) {
    return this.categoryRepository.createCategory(data);
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    const category = await this.categoryRepository.updateCategory(id, data);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.deleteCategory(id);
    if (!category) throw new NotFoundError("Category not found");
    return 0;
  }
}
