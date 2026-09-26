import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper";
import { createTestTicket } from "./helpers/create-test-ticket";
import type { TicketStatus } from "@/shared/db/schemas";
import app from "@/server";
import { ERROR_MESSAGE } from "@/shared/constants/error-message.constant";

describe("Update Ticket Status", async () => {
  let user: ReturnType<typeof request.agent>;
  let admin: ReturnType<typeof request.agent>;
  let ticketId: string;
  let status: TicketStatus;

  beforeAll(async () => {
    const { agent: userAgent, userId } = await authenticate();
    const { agent: adminAgent } = await authenticate("admin");
    ticketId = await createTestTicket(userId);
    status = "in_progress";
    user = userAgent;
    admin = adminAgent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).patch(`/api/tickets/${ticketId}/status`).send({ status });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(ERROR_MESSAGE.UNAUTHORIZED);
  });

  it('should return 403 when user is not admin', async () => {
    const res = await user.patch(`/api/tickets/${ticketId}/status`).send({ status });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(ERROR_MESSAGE.FORBIDDEN);
  });

  it('should return 400 when ticket status is invalid', async () => {
    const res = await admin.patch(`/api/tickets/${ticketId}/status`).send({ status: "invalid" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].message).toBe("Invalid ticket status");
  });

  it('should return 200 when ticket status updated', async () => {
    const res = await admin.patch(`/api/tickets/${ticketId}/status`).send({ status });

    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Ticket status updated");
    expect(res.body.data.ticketStatus).toBe(status);
  });
});
