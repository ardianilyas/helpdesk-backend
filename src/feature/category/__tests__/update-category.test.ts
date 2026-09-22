import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper";
import { seedCategory } from "@/shared/seeder/category.seed";
import type { UpdateCategoryDto } from "../category.dto";
import app from "@/server";
import { ERROR_MESSAGE } from "@/shared/constants/error-message.constant";
import { INVALID_UUID } from "@/shared/constants/test.constant";

describe("Update Category", () => {
  let user: ReturnType<typeof request.agent>;
  let admin: ReturnType<typeof request.agent>;
  let categoryId: string;
  let payload: UpdateCategoryDto;

  beforeAll(async() => {
    const { agent: userAgent } = await authenticate();
    const { agent: adminAgent } = await authenticate("admin");

    payload = {
      name: "Test Category - updated",
    }

    const category = await seedCategory(1);
    if (!category) throw new Error("Failed to create category");
    categoryId = category[0]?.id!;

    user = userAgent;
    admin = adminAgent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).patch(`/api/categories/${categoryId}`).send(payload);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(ERROR_MESSAGE.UNAUTHORIZED);
  });

  it('should return 403 when user is not admin', async () => {
    const res = await user.patch(`/api/categories/${categoryId}`).send(payload);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(ERROR_MESSAGE.FORBIDDEN);
  });

  it('should return 400 when id is invalid format', async () => {
    const res = await admin.patch(`/api/categories/invalid-id-format`).send(payload);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(ERROR_MESSAGE.VALIDATION_ERROR);
    expect(res.body.errors[0].message).toBe("Invalid id format");
  });

  it('should return 404 when category not found', async () => {
    const res = await admin.patch(`/api/categories/${INVALID_UUID}`).send(payload);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Category not found");
  });

  it('should return 200 when data is valid', async () => {
    const res = await admin.patch(`/api/categories/${categoryId}`).send(payload);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Category updated successfully");
    expect(res.body.data.name).toBe(payload.name);
  });
});
