import { faker } from "@faker-js/faker";
import { seedCategory } from "./category.seed";
import { ticketPriorityEnum, tickets } from "../db/schemas";
import { db } from "../db";

type InsertTicketData = typeof tickets.$inferInsert

export async function seedTicket(length: number, userId: string) {
  const categories = await seedCategory();
  const data: InsertTicketData[] = Array.from({ length }, (_, _index) => ({
    userId,
    title: faker.word.adjective(),
    description: faker.lorem.sentence(),
    categoryId: faker.helpers.arrayElement(categories).id,
    ticketPriority: faker.helpers.arrayElement(ticketPriorityEnum.enumValues),
  }));

  return db.insert(tickets).values(data).returning();
}