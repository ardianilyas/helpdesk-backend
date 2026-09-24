import { NotFoundError } from "@/shared/errors/not-found";
import type { CreateTicketDto, Ticket, UpdateTicketDto } from "./ticket.dto";
import type { TicketRepository } from "./ticket.repository";
import { BadRequestError } from "@/shared/errors/bad-request";

export class TicketService {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async getTickets(): Promise<Ticket[]> {
    return this.ticketRepository.getTickets();
  }

  async getTicket(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.getTicket(id);
    
    if (!ticket) throw new NotFoundError("Ticket not found");
    
    return ticket;
  }

  async createTicket(data: CreateTicketDto, userId: string): Promise<Ticket | undefined> {
    const category = await this.ticketRepository.getCategory(data.categoryId);

    if (!category) throw new NotFoundError("Category not found");
    
    const ticket = await this.ticketRepository.createTicket(data, userId);
    
    if(!ticket) throw new BadRequestError("Failed to create ticket");
    
    return ticket;
  }

  async updateTicket(data: UpdateTicketDto, id: string): Promise<Ticket | undefined> {
    const ticket = await this.ticketRepository.updateTicket(data, id);
    
    if(!ticket) throw new NotFoundError("Ticket not found");
    
    return ticket;
  }

  async deleteTicket(id: string): Promise<Ticket | undefined> {
    return this.ticketRepository.deleteTicket(id);
  }
}
