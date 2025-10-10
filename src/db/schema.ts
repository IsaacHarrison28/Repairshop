import { pgTable, serial, varchar, boolean, timestamp, integer, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const Customers = pgTable("customers", {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }).notNull(),
    address: text("address").notNull(),
    notes: text("notes"),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
})

export const tickets = pgTable("tickets", {
    id: serial("id").primaryKey(),
    customerId: integer("customer_id").notNull().references(() => Customers.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    completed: boolean("completed").default(false).notNull(),
    tech: varchar("tech", { length: 100 }).notNull().default("Unassigned"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
})

//define relations
export const customersRelations = relations(Customers, ({ many }) => ({
    tickets: many(tickets),
}))

export const ticketsRelations = relations(tickets, ({one}) =>({
    Customers: one(Customers, {
        fields: [tickets.customerId],
        references: [Customers.id]
    })
}))
