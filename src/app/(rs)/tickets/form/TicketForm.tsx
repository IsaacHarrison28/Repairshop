"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { type SelectCustomerSchemaType } from "@/zod-schemas/customer";
import {
  ticketInsertSchema,
  type InsertTicketSchemaType,
  type SelectTicketSchemaType,
} from "@/zod-schemas/ticket";

type props = {
  ticket?: SelectTicketSchemaType | null;
  customer?: SelectCustomerSchemaType | null;
};

export default function TicketForm({ ticket, customer }: props) {
  const defaultValues: InsertTicketSchemaType = {
    id: ticket?.id ?? "(New)",
    title: ticket?.title ?? "",
    description: ticket?.description ?? "",
    tech: ticket?.tech ?? "newticket@example.com",
    customerId: customer?.id ?? 0,
    completed: ticket?.completed ?? false,
  };

  const form = useForm<InsertTicketSchemaType>({
    resolver: zodResolver(ticketInsertSchema),
    defaultValues,
    mode: "onBlur",
  });

  async function submitForm(data: InsertTicketSchemaType) {
    console.log(data);
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <div>
        <h2 className="text-2xl font-bold">
          {ticket ? `Edit Ticket #${ticket.id}` : "New Ticket"}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col sm:flex-row gap-4 sm:gap-8"
        >
          <p>{JSON.stringify(form.getValues())}</p>
        </form>
      </Form>
    </div>
  );
}
