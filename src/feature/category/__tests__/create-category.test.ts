import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper";
import type { CreateCategoryDto } from "../category.dto";
import app from "@/server";
import { ERROR_MESSAGE } from "@/shared/constants/error-message.constant";

describe("Create Category", () => {
  let user: ReturnType<typeof request.agent>;
  let admin: ReturnType<typeof request.agent>;
  let payload: CreateCategoryDto;
  beforeAll(async () => {
    const { agent } = await authenticate();
    const { agent: adminAgent } = await authenticate("admin");

    payload = {
      name: "Test Category",
      description: "This is a test category",
    };

    user = agent;
    admin = adminAgent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).post("/api/categories").send(payload);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(ERROR_MESSAGE.UNAUTHORIZED);
  });

  it('should return 403 when user is not admin', async () => {
    const res = await user.post("/api/categories").send(payload);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(ERROR_MESSAGE.FORBIDDEN);
  });

  it('should return 400 when data is invalid', async () => {
    const res = await admin.post("/api/categories").send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(ERROR_MESSAGE.VALIDATION_ERROR);
  });

  it('should return 201 when data is valid and category created', async () => {
    const res = await admin.post("/api/categories").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Category created successfully");
    expect(res.body.data.name).toBe(payload.name);
    expect(res.body.data.description).toBe(payload.description);
  });
});
