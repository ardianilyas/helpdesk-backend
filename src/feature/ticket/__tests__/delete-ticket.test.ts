import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createTestTicket } from "./helpers/create-test-ticket";
import { authenticate } from "../../../../tests/helpers/auth.helper";
import app from "@/server";
import { ERROR_MESSAGE } from "@/shared/constants/error-message.constant";
import { INVALID_UUID } from "@/shared/constants/test.constant";

describe("Delete Ticket", async () => {
  let user: ReturnType<typeof request.agent>;
  let ticketId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    ticketId = await createTestTicket(userId);
    user = agent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).delete(`/api/tickets/${ticketId}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(ERROR_MESSAGE.UNAUTHORIZED);
  });

  it('should return 404 when ticket not found', async () => {
    const res = await user.delete(`/api/tickets/${INVALID_UUID}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Ticket not found");
  });

  it('should return 200 when ticket deleted', async () => {
    const res = await user.delete(`/api/tickets/${ticketId}`);

    expect(res.status).toBe(204);
  });
});