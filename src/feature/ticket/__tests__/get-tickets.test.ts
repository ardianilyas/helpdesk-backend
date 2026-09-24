import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper";
import { seedTicket } from "@/shared/seeder/ticket.seed";
import app from "@/server";
import { ERROR_MESSAGE } from "@/shared/constants/error-message.constant";

describe("Get Tickets", () => {
  let user: ReturnType<typeof request.agent>;
  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    await seedTicket(10, userId);
    user = agent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).get("/api/tickets");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(ERROR_MESSAGE.UNAUTHORIZED);
  });

  it('should return 200 and return tickets data', async () => {
    const res = await user.get("/api/tickets");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Tickets fetched");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(10);
  });
});
