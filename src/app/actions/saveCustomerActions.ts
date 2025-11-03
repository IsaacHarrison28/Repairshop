"use server";

import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { customers } from "@/db/schema";
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
        const result = await db
          .insert(customers)
          .values({
            firstName: customer.firstName ?? "",
            lastName: customer.lastName ?? "",
            email: customer.email?.toLocaleLowerCase() ?? "",
            phone: customer.phone ?? "",
            address: customer.address ?? "",
            active: customer.active,
            ...(customer.notes?.trim() ? { notes: customer.notes } : {}),
          } as any)
          .returning({ insertedId: customers.id });

        return {
          message: `customer ID ${result[0].insertedId} created successfully`,
        };
      }

      const result = await db
        .update(customers)
        .set({
          firstName: customer.firstName,
          lastName: customer.lastName,
          address: customer.address,
          email: customer.email?.toLocaleLowerCase(),
          notes: customer.notes?.trim() ?? null,
          active: customer.active,
        })
        .where(eq(customers.id, customer.id!))
        .returning({ UpdatedId: customers.id });

      return {
        message: `Customerm ID ${result[0].UpdatedId} updated successfully!`,
      };
    }
  );
