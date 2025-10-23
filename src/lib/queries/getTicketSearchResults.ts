import { db } from "@/db";
import { eq, ilike, or } from "drizzle-orm";
import { tickets, Customers } from "@/db/schema";

export async function getTicketSearchResults(SearchText: string) {
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
    .where(
      or(
        ilike(tickets.title, `%${SearchText}%`),
        ilike(tickets.description, `%${SearchText}%`),
        ilike(tickets.tech, `%${SearchText}%`),
        ilike(Customers.email, `%${SearchText}%`),
        ilike(Customers.firstName, `%${SearchText}%`),
        ilike(Customers.lastName, `%${SearchText}%`),
        ilike(Customers.phone, `%${SearchText}%`),
        ilike(Customers.address, `%${SearchText}%`)
      )
    );

  return results;
}
