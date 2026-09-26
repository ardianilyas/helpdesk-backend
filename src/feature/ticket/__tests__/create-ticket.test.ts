import { createTestCategory } from "@/feature/category/__tests__/helpers/create-test-category";
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper";
import app from "@/server";
import { ERROR_MESSAGE } from "@/shared/constants/error-message.constant";
import { INVALID_UUID } from "@/shared/constants/test.constant";

describe("Create Ticket", () => {
  let categoryId: string;
  let user: ReturnType<typeof request.agent>;
  beforeAll(async () => {
    const { agent } = await authenticate();
    categoryId = await createTestCategory();
    user = agent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).post("/api/tickets").send({
      title: "Test Ticket",
      description: "This is a test ticket",
      categoryId,
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(ERROR_MESSAGE.UNAUTHORIZED);
  });

  it('should return 404 when category id is invalid', async () => {
    const res = await user.post(`/api/tickets`).send({
      title: "Test Ticket",
      description: "This is a test ticket",
      categoryId: INVALID_UUID
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Category not found");
  });

  it('should return 400 when data is invalid', async () => {
    const res = await user.post(`/api/tickets`).send({
      title: "",
      description: "This is a test ticket",
      categoryId,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(ERROR_MESSAGE.VALIDATION_ERROR);
    expect(res.body.errors[0].message).toBe("Title is required");
  });

  it('should return 201 when ticket created', async () => {
    const res = await user.post(`/api/tickets`).send({
      title: "Test Ticket",
      description: "This is a test ticket",
      categoryId,
    });

    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
  });
});
