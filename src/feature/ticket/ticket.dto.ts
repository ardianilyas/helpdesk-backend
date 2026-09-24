import { ticketPriorityEnum, tickets } from "@/shared/db/schemas";
import z from "zod";

export type Ticket = typeof tickets.$inferSelect;

export const createTicketDto = z.object({
  categoryId: z.uuid({ error: "Invalid category id format" }),
  title: z.string().min(1, { error: "Title is required" }).min(3, { error: "Title must be at least 3 characters" }),
  description: z.string().min(1, { error: "Description is required" }).min(3, { error: "Description must be at least 3 characters" }),
  ticketPriority: z.enum(ticketPriorityEnum.enumValues, { error: "Invalid ticket priority" }).optional(),
});

export const updateTicketDto = createTicketDto.partial();
export const getTicketDto = z.uuid({ error: "Invalid id format" });

export type CreateTicketDto = z.infer<typeof createTicketDto>;
export type UpdateTicketDto = z.infer<typeof updateTicketDto>;
export type GetTicketDto = z.infer<typeof getTicketDto>;
