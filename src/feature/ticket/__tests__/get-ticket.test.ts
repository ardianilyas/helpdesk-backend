import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper";
import { createTestTicket } from "./helpers/create-test-ticket";
import app from "@/server";
import { ERROR_MESSAGE } from "@/shared/constants/error-message.constant";
import { INVALID_UUID } from "@/shared/constants/test.constant";

describe("Get Ticket", () => {
  let user: ReturnType<typeof request.agent>;
  let ticketId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    ticketId = await createTestTicket(userId);
    user = agent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).get(`/api/tickets/${ticketId}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(ERROR_MESSAGE.UNAUTHORIZED);
  });

  it('should return 404 when ticket not found', async () => {
    const res = await user.get(`/api/tickets/${INVALID_UUID}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Ticket not found");
  });

  it('should return 400 when invalid id format', async () => {
    const res = await user.get(`/api/tickets/invalid-id-format`);

    expect(res.status).toBe(400);
    expect(res.body.errors[0].message).toBe("Invalid id format");
  });

  it('should return 200 and return ticket data', async () => {
    const res = await user.get(`/api/tickets/${ticketId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Ticket fetched");
    expect(res.body.data).toBeDefined();
  });
});
