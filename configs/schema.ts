// src/configs/schema.ts
import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

export const HistoryTable = pgTable("historyTable", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    recordId: varchar({ length: 255 }).notNull(), // Added length
    content: json().notNull(),
    userEmail: varchar('userEmail', { length: 255 }).references(() => usersTable.email), // Added length
    createdAt: varchar({ length: 255 }), // Added length
    aiAgentType: varchar({ length: 255 }), // Added length
    metaData: varchar({ length: 255 }) // Added length
});