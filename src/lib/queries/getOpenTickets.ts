import { db } from "@/db";
import { eq } from "drizzle-orm";
import { tickets, Customers } from "@/db/schema";

export async function getOpenTickets() {
  const results = await db
    .select({
      TicketDate: tickets.createdAt,
      Title: tickets.title,
      FirstName: Customers.firstName,
      LastName: Customers.lastName,
      Email: Customers.email,
      Tech: tickets.tech,
    })
    .from(tickets)
    .leftJoin(Customers, eq(tickets.customerId, Customers.id))
    .where(eq(tickets.completed, false));

  return results;
}
