import { asyncHandler } from "@/shared/utils/async-handler";
import type { CategoryService } from "./category.service";
import type { Request, Response } from "express";
import { sendSuccess } from "@/shared/utils/response";
import { validate } from "@/shared/utils/validate";
import { createCategoryDto, getCategoryDto, updateCategoryDto } from "./category.dto";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await this.categoryService.getCategories();
    return sendSuccess(res, "Categories fetched successfully", categories);
  });

  getCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getCategoryDto, req.params.id);
    const category = await this.categoryService.getCategory(id);
    return sendSuccess(res, "Category fetched successfully", category);
  });

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const data = validate(createCategoryDto, req.body);
    const category = await this.categoryService.createCategory(data);
    return sendSuccess(res, "Category created successfully", category, 201);
  });

  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getCategoryDto, req.params.id);
    const data = validate(updateCategoryDto, req.body);
    const category = await this.categoryService.updateCategory(id, data);
    return sendSuccess(res, "Category updated successfully", category);
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getCategoryDto, req.params.id);
    const category = await this.categoryService.deleteCategory(id);
    return sendSuccess(res, "Category deleted successfully", category);
  });
}
