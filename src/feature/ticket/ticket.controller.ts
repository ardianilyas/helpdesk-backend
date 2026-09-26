import { asyncHandler } from "@/shared/utils/async-handler";
import type { TicketService } from "./ticket.service";
import type { Request, Response } from "express";
import { sendSuccess } from "@/shared/utils/response";
import { validate } from "@/shared/utils/validate";
import { createTicketDto, getTicketDto, updateTicketDto, updateTicketStatusDto } from "./ticket.dto";
import type { AuthenticatedRequest } from "@/shared/types";

export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  getTickets = asyncHandler(async (req: Request, res: Response) => {
    const tickets = await this.ticketService.getTickets();
    return sendSuccess(res, "Tickets fetched", tickets);
  });

  getTicket = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getTicketDto, req.params.id);
    const ticket = await this.ticketService.getTicket(id);
    return sendSuccess(res, "Ticket fetched", ticket);
  });

  createTicket = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validate(createTicketDto, req.body);
    const ticket = await this.ticketService.createTicket(data, req.auth.user.id);
    return sendSuccess(res, "Tickets created", ticket, 201);
  });

  updateTicket = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getTicketDto, req.params.id);
    const data = validate(updateTicketDto, req.body);
    const ticket = await this.ticketService.updateTicket(data, id);
    return sendSuccess(res, "Ticket updated", ticket);
  });

  updateTicketStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getTicketDto, req.params.id);
    const { status } = validate(updateTicketStatusDto, req.body);
    const ticket = await this.ticketService.updateTicketStatus(status, id);
    return sendSuccess(res, "Ticket status updated", ticket);
  })

  deleteTicket = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getTicketDto, req.params.id);
    await this.ticketService.deleteTicket(id);
    return sendSuccess(res, "", null, 204);
  });
}