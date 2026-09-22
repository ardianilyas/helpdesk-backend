import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper";
import { seedCategory } from "@/shared/seeder/category.seed";
import app from "@/server";
import { ERROR_MESSAGE } from "@/shared/constants/error-message.constant";
import { INVALID_UUID } from "@/shared/constants/test.constant";

describe("Delete Category", async () => {
  let admin: ReturnType<typeof request.agent>;
  let user: ReturnType<typeof request.agent>;
  let categoryId: string;

  beforeAll(async () => {
    const { agent: adminAgent } = await authenticate("admin");
    const { agent: userAgent } = await authenticate();
    const category = await seedCategory(1);

    if (!category) throw new Error("Failed to create category");
    categoryId = category[0]?.id!;

    admin = adminAgent;
    user = userAgent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).delete(`/api/categories/${categoryId}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(ERROR_MESSAGE.UNAUTHORIZED);
  });

  it('should return 403 when user is not admin', async () => {
    const res = await user.delete(`/api/categories/${categoryId}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(ERROR_MESSAGE.FORBIDDEN);
  });

  it('should return 404 when category not found', async () => {
    const res = await admin.delete(`/api/categories/${INVALID_UUID}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Category not found");
  });

  it('should return 200 when category deleted', async () => {
    const res = await admin.delete(`/api/categories/${categoryId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Category deleted successfully");
  });
});
