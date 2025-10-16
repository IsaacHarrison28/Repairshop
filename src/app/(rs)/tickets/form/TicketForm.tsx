"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { CheckBoxWithLabel } from "@/components/inputs/CheckBoxWithLabel";
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
          className="flex flex-col md:flex-row gap-4 md:gap-8"
        >
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <InputWithLabel<InsertTicketSchemaType>
              fieldTitle="Title"
              nameInSchema="title"
              placeholder="Title"
            />
            <InputWithLabel<InsertTicketSchemaType>
              fieldTitle="Tech"
              nameInSchema="tech"
              placeholder="Tech"
              disabled={true}
            />
            <CheckBoxWithLabel<InsertTicketSchemaType>
              fieldTitle="Completed"
              nameInSchema="completed"
              message={ticket?.completed ? "Completed" : "Not Completed"}
            />
            <div className="mt-4 space-y-2">
              <h3 className="text-lg">Customer Info</h3>
              <hr className="w-4/5" />
              <p>
                {customer?.firstName} {customer?.lastName}
              </p>
              <p>{customer?.address}</p>
              <hr className="w-4/5" />
              <p>{customer?.email}</p>
              <p>{customer?.phone}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <TextAreaWithLabel<InsertTicketSchemaType>
              fieldTitle="Description"
              nameInSchema="description"
              placeholder="Description"
              className="h-40"
              value={ticket ? ticket.description ?? "" : ""}
            />

            <div className="flex gap-2 mt-4">
              <Button
                type="submit"
                className="w-3/4"
                variant="default"
                title="Save"
              >
                Save
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="cursor-pointer"
                title="Reset"
                onClick={() => {
                  form.reset(defaultValues);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
