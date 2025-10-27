import { db } from "@/db";
import { eq, ilike, or, sql, asc } from "drizzle-orm";
import { tickets, Customers } from "@/db/schema";

export async function getTicketSearchResults(SearchText: string) {
  const results = await db
    .select({
      id: tickets.id,
      TicketDate: tickets.createdAt,
      Title: tickets.title,
      FirstName: Customers.firstName,
      LastName: Customers.lastName,
      Email: Customers.email,
      Tech: tickets.tech,
      Completed: tickets.completed,
    })
    .from(tickets)
    .leftJoin(Customers, eq(tickets.customerId, Customers.id))
    .where(
      or(
        ilike(tickets.title, `%${SearchText}%`),
        ilike(tickets.tech, `%${SearchText}%`),
        ilike(Customers.email, `%${SearchText}%`),
        ilike(Customers.phone, `%${SearchText}%`),
        sql`lower(concat(${Customers.firstName}, ' ', ${
          Customers.lastName
        })) LIKE ${`%${SearchText.toLocaleLowerCase().replace(" ", "%")}%`}`
      )
    )
    .orderBy(asc(tickets.createdAt));

  return results;
}

export type getTicketSearchResultsType = Awaited<
  ReturnType<typeof getTicketSearchResults>
>;
