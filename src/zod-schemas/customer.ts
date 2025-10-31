import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { customers } from "@/db/schema";
import { z } from "zod";

export const customerInsertSchema = createInsertSchema(customers, {
  firstName: (schema) => schema.min(1, "First name is required"),
  lastName: (schema) => schema.min(1, "Last name is required"),
  email: (schema) => schema.email("Invalid email address").optional(),
  phone: (schema) => schema.min(1, "Phone number is required"),
  address: (schema) => schema.min(1, "Address is required"),
});

export const customerSelectSchema = createSelectSchema(customers);

export type InsertCustomerSchemaType = z.infer<typeof customerInsertSchema>;
export type SelectCustomerSchemaType = z.infer<typeof customerSelectSchema>;
