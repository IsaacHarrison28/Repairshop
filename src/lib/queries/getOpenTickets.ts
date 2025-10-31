import { db } from "@/db";
import { asc, eq } from "drizzle-orm";
import { tickets, customers } from "@/db/schema";

export async function getOpenTickets() {
  const results = await db
    .select({
      id: tickets.id,
      TicketDate: tickets.createdAt,
      Title: tickets.title,
      FirstName: customers.firstName,
      LastName: customers.lastName,
      Email: customers.email,
      Tech: tickets.tech,
      Completed: tickets.completed,
    })
    .from(tickets)
    .leftJoin(customers, eq(tickets.customerId, customers.id))
    .where(eq(tickets.completed, false))
    .orderBy(asc(tickets.createdAt));

  return results;
}
