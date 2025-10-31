import { db } from "@/db";
import { eq, ilike, or, sql, asc } from "drizzle-orm";
import { tickets, customers } from "@/db/schema";

export async function getTicketSearchResults(SearchText: string) {
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
    .where(
      or(
        ilike(tickets.title, `%${SearchText}%`),
        ilike(tickets.tech, `%${SearchText}%`),
        ilike(customers.email, `%${SearchText}%`),
        ilike(customers.phone, `%${SearchText}%`),
        sql`lower(concat(${customers.firstName}, ' ', ${
          customers.lastName
        })) LIKE ${`%${SearchText.toLocaleLowerCase().replace(" ", "%")}%`}`
      )
    )
    .orderBy(asc(tickets.createdAt));

  return results;
}

export type getTicketSearchResultsType = Awaited<
  ReturnType<typeof getTicketSearchResults>
>;
