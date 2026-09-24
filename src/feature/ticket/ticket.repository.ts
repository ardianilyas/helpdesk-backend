import { db } from "@/shared/db";
import { categories, tickets } from "@/shared/db/schemas";
import { eq } from "drizzle-orm";
import type { CreateTicketDto, Ticket, UpdateTicketDto } from "./ticket.dto";
import type { Category } from "../category/category.dto";

export class TicketRepository {
  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getTickets(): Promise<Ticket[]> {
    return db.query.tickets.findMany({
      with: {
        category: true,
        user: true,
      }
    });
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    const ticket = await db.query.tickets.findFirst({
      where: eq(tickets.id, id),
      with: {
        category: true,
        user: true,
      }
    });

    return ticket;
  }

  async createTicket(data: CreateTicketDto, userId: string): Promise<Ticket | undefined> {
    const [ticket] = await db.insert(tickets).values({ ...data, userId }).returning();
    
    return ticket;
  }

  async updateTicket(data: UpdateTicketDto, id: string): Promise<Ticket | undefined> {
    const [ticket] = await db.update(tickets).set(data).where(eq(tickets.id, id)).returning();

    return ticket;
  }

  async deleteTicket(id: string): Promise<Ticket | undefined> {
    const [ticket] = await db.delete(tickets).where(eq(tickets.id, id)).returning();

    return ticket;
  }
}
