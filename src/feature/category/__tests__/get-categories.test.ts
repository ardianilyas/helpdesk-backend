import { seedCategory } from "@/shared/seeder/category.seed";
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper";
import app from "@/server";

describe("Get Categories", () => {
  let user: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    await seedCategory(10);
    const { agent } = await authenticate();
    user = agent;
  });

  it("should return 401 when user unauthorized", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should return 200 and categories when user authorized", async () => {
    const res = await user.get("/api/categories");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Categories fetched successfully");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(10);
  });
});

