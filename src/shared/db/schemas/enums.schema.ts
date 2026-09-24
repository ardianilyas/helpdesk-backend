import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", 
  ["admin", "user"]
);

export const ticketPriorityEnum = pgEnum("ticket_priority", 
  ["low", "medium", "high"]
);

export const ticketStatusEnum = pgEnum("ticket_status", 
  ["open", "in_progress", "resolved", "closed"]
);

export type UserRole = typeof roleEnum.enumValues[number];
export type TicketPriority = typeof ticketPriorityEnum.enumValues[number];
export type TicketStatus = typeof ticketStatusEnum.enumValues[number];
