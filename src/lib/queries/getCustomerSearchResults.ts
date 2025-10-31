import { db } from "@/db";
import { customers } from "@/db/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function getCustomerSearchResults(SearchText: string) {
  const results = await db
    .select()
    .from(customers)
    .where(
      or(
        ilike(customers.firstName, `%${SearchText}%`),
        ilike(customers.lastName, `%${SearchText}%`),
        ilike(customers.email, `%${SearchText}%`),
        ilike(customers.phone, `%${SearchText}%`),
        sql`lower(concat(${customers.firstName}, ' ', ${
          customers.lastName
        })) LIKE ${`%${SearchText.toLocaleLowerCase().replace(" ", "%")}%`}`
      )
    )
    .orderBy(customers.lastName);
  return results;
}
