import { relations } from "drizzle-orm";
import { categories, tickets, user } from "../schemas";

export const ticketRelation = relations(tickets, ({ one }) => ({
  category: one(categories, {
    fields: [tickets.categoryId],
    references: [categories.id],
  }),
  user: one(user, {
    fields: [tickets.userId],
    references: [user.id],
  }),
}));
