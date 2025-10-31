import { db } from "@/db";
import { Customers } from "@/db/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function getCustomerSearchResults(SearchText: string) {
  const results = await db
    .select()
    .from(Customers)
    .where(
      or(
        ilike(Customers.firstName, `%${SearchText}%`),
        ilike(Customers.lastName, `%${SearchText}%`),
        ilike(Customers.email, `%${SearchText}%`),
        ilike(Customers.phone, `%${SearchText}%`),
        sql`lower(concat(${Customers.firstName}, ' ', ${
          Customers.lastName
        })) LIKE ${`%${SearchText.toLocaleLowerCase().replace(" ", "%")}%`}`
      )
    )
    .orderBy(Customers.lastName);
  return results;
}
