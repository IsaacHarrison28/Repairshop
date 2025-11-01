"use server";

import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { tickets } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import {
  ticketInsertSchema,
  type InsertTicketSchemaType,
} from "@/zod-schemas/ticket";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";

export const saveTicketAction = actionClient
  .metadata({ actionName: "saveTicketAction" })
  .schema(ticketInsertSchema, {
    handleValidationErrorsShape: async (ve) => {
      return flattenValidationErrors(ve).fieldErrors;
    },
  })
  .action(
    async ({
      parsedInput: ticket,
    }: {
      parsedInput: InsertTicketSchemaType;
    }) => {
      const { isAuthenticated } = getKindeServerSession();
      const isAuth = await isAuthenticated();

      if (!isAuth) redirect("/login");

      //New ticket
      if (ticket.id === "(New)") {
        const result = await db
          .insert(tickets)
          .values({
            customerId: ticket.customerId,
            title: ticket.title,
            description: ticket.description,
            tech: ticket.tech,
          })
          .returning({ InsertedId: tickets.id });

        return {
          message: `Ticket ID ${result[0].InsertedId} created successfully!`,
        };
      }

      //updating ticket
      const result = await db
        .update(tickets)
        .set({
          customerId: ticket.customerId,
          title: ticket.title,
          description: ticket.description,
          tech: ticket.tech,
          completed: ticket.completed,
        })
        .where(eq(tickets.id, ticket.id))
        .returning({ UpdatedID: tickets.id });

      return {
        message: `Ticket ID ${result[0].UpdatedID} updated successfully!`,
      };
    }
  );
