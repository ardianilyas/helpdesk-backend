import { relations } from "drizzle-orm";
import { categories, tickets } from "../schemas";

export const categoryRelation = relations(categories, ({ many }) => ({
  tickets: many(tickets),
}));
