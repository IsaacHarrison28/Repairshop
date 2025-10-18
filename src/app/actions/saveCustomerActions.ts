"use server";

import { eq } from "drizzle-orm";
import {
  FlattenedValidationErrors,
  flattenValidationErrors,
} from "next-safe-action";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { Customers } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import {
  customerInsertSchema,
  type InsertCustomerSchemaType,
} from "@/zod-schemas/customer";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const saveCustomerAction = actionClient
  .metadata({ actionName: "saveCustomerAction" })
  .schema(customerInsertSchema, {
    handleValidationErrorsShape: async (ve) => {
      return flattenValidationErrors(ve).fieldErrors;
    },
  })
  .action(
    async ({
      parsedInput: customer,
    }: {
      parsedInput: InsertCustomerSchemaType;
    }) => {
      const { isAuthenticated } = getKindeServerSession();
      const isAuth = await isAuthenticated();

      if (!isAuth) redirect("/login");

      //New customer
      if (customer.id === 0) {
        // coalesce possibly-undefined strings to ensure types match Drizzle's expected non-optional string types
        const result = await db
          .insert(Customers)
          .values({
            firstName: customer.firstName ?? "",
            lastName: customer.lastName ?? "",
            email: customer.email ?? "",
            phone: customer.phone ?? "",
            address: customer.address ?? "",
            active: customer.active,
            ...(customer.notes?.trim() ? { notes: customer.notes } : {}),
          } as any)
          .returning({ insertedId: Customers.id });

        return {
          message: `customer ID ${result[0].insertedId} created successfully`,
        };
      }

      const result = await db
        .update(Customers)
        .set({
          firstName: customer.firstName,
          lastName: customer.lastName,
          address: customer.address,
          email: customer.email,
          notes: customer.notes?.trim() ?? null,
          active: customer.active,
        })
        .where(eq(Customers.id, customer.id!))
        .returning({ UpdatedId: Customers.id });

      return {
        message: `Customerm ID ${result[0].UpdatedId} updated successfully!`,
      };
    }
  );
