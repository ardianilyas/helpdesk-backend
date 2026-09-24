import { seedTicket } from "@/shared/seeder/ticket.seed";

export async function createTestTicket(userId: string): Promise<string> {
  const ticket = await seedTicket(1, userId);

  if (!ticket[0]?.id) throw new Error("Failed to create ticket");

  return ticket[0].id;
}