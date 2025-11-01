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
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { useAction } from "next-safe-action/hooks";
import { saveTicketAction } from "@/app/actions/saveTicketActions";
import { toast } from "sonner";
import { DisplayServerActionResult } from "@/components/displayServerActionResponse";
import { LoaderCircle } from "lucide-react";

type props = {
  ticket?: SelectTicketSchemaType | null;
  customer?: SelectCustomerSchemaType | null;
  techs?: { id: string; description: string }[];
  isEditable?: boolean;
  isManager?: boolean | undefined;
};

export default function TicketForm({
  ticket,
  customer,
  techs,
  isEditable = true,
  isManager = false,
}: props) {
  const defaultValues: InsertTicketSchemaType = {
    id: ticket?.id ?? "(New)",
    title: ticket?.title ?? "",
    description: ticket?.description ?? "",
    tech: ticket?.tech.toLowerCase() ?? "newticket@example.com",
    customerId: customer?.id ?? 0,
    completed: ticket?.completed ?? false,
  };

  const form = useForm<InsertTicketSchemaType>({
    resolver: zodResolver(ticketInsertSchema),
    defaultValues,
    mode: "onBlur",
  });

  const {
    execute: executeSave,
    result: saveResult,
    isExecuting: isSaving,
    reset: resetSaveAction,
  } = useAction(saveTicketAction, {
    onSuccess({ data }) {
      //toast the user
      toast.success("Success! 🎉", { description: data?.message });
    },
    onError() {
      //toast the user to display the error
      toast.error("Error!", { description: "Failed to save!" });
    },
  });

  async function submitForm(data: InsertTicketSchemaType) {
    // console.log(data);
    executeSave(data);
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <DisplayServerActionResult result={saveResult} />
      <div>
        <h2 className="text-2xl font-bold">
          {ticket?.id && isEditable
            ? `Edit Ticket # ${ticket.id}`
            : ticket?.id
            ? `View Ticket # ${ticket.id}`
            : "New Ticket Form"}
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
              disabled={!isEditable}
            />
            {isManager && techs ? (
              <SelectWithLabel<InsertTicketSchemaType>
                fieldTitle="Tech ID"
                nameInSchema="tech"
                data={[
                  {
                    id: "newticket@example.com",
                    description: "newticket@example.com",
                  },
                  ...techs,
                ]}
              />
            ) : (
              <InputWithLabel<InsertTicketSchemaType>
                fieldTitle="Tech"
                nameInSchema="tech"
                placeholder="Tech"
                disabled={true}
              />
            )}
            {ticket?.id ? (
              <CheckBoxWithLabel<InsertTicketSchemaType>
                fieldTitle="Completed"
                nameInSchema="completed"
                message={ticket?.completed ? "Completed" : "Not Completed"}
                disabled={!isEditable}
              />
            ) : null}
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
              defaultValue={ticket?.id ? ticket?.description ?? "" : undefined}
              disabled={!isEditable}
            />

            {isEditable ? (
              <div className="flex gap-2 mt-4">
                <Button
                  type="submit"
                  className="w-3/4"
                  variant="default"
                  title="Save"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="cursor-pointer"
                  title="Reset"
                  onClick={() => {
                    form.reset(defaultValues);
                    resetSaveAction();
                  }}
                >
                  Reset
                </Button>
              </div>
            ) : null}
          </div>
        </form>
      </Form>
    </div>
  );
}
