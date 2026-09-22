import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { seedCategory } from "@/shared/seeder/category.seed";
import { authenticate } from "../../../../tests/helpers/auth.helper";
import app from "@/server";
import { ERROR_MESSAGE } from "@/shared/constants/error-message.constant";
import { INVALID_UUID } from "@/shared/constants/test.constant";

describe("Get Category", () => {
  let user: ReturnType<typeof request.agent>;
  let categoryId: string;

  beforeAll(async () => {
    const { agent } = await authenticate();
    const category = await seedCategory(1);

    if (!category) throw new Error("Failed to create category");
    categoryId = category[0]?.id!;

    user = agent;
  });

  it('should return 401 when user unauthorized', async () => {
    const res = await request(app).get(`/api/categories/${categoryId}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(ERROR_MESSAGE.UNAUTHORIZED);
  });

  it('should return 404 when category not found', async () => {
    const res = await user.get(`/api/categories/${INVALID_UUID}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Category not found");
  });

  it('should return 400 when invalid id format', async () => {
    const res = await user.get(`/api/categories/invalid-id-format`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation Error");
  });

  it('should return 200 when category found', async () => {
    const res = await user.get(`/api/categories/${categoryId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Category fetched successfully");
    expect(res.body.data).toBeInstanceOf(Object);
  });
});
