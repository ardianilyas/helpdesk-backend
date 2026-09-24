import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { ticketPriorityEnum, ticketStatusEnum } from "./enums.schema";
import { user } from "./users.schema";
import { categories } from "./category.schema";

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "set null" }),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  ticketPriority: ticketPriorityEnum().default("low").notNull(),
  ticketStatus: ticketStatusEnum().default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});
