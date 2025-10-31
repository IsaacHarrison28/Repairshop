import { db } from "@/db";
import { customers, tickets } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCustomer(id: number) {
  const customer = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id));

  return customer[0];
}

export async function getTickets(id: number) {
  const ticket = await db.select().from(tickets).where(eq(tickets.id, id));

  return ticket[0];
}
