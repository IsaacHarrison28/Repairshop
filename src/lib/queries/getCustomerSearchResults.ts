import { db } from "@/db";
import { Customers } from "@/db/schema";
import { ilike, or } from "drizzle-orm";

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
        ilike(Customers.notes, `%${SearchText}%`)
      )
    );
  return results;
}
