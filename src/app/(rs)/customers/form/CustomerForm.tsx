"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  customerInsertSchema,
  type InsertCustomerSchemaType,
  type SelectCustomerSchemaType,
} from "@/zod-schemas/customer";

type props = {
  customer?: SelectCustomerSchemaType | null;
};

export function CustomerForm({ customer }: props) {
  const defaultValues: InsertCustomerSchemaType = {
    id: customer?.id ?? 0,
    firstName: customer?.firstName ?? "",
    lastName: customer?.lastName ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    address: customer?.address ?? "",
  };

  const form = useForm<InsertCustomerSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(customerInsertSchema),
    defaultValues,
  });

  async function submitForm(data: InsertCustomerSchemaType) {
    console.log(data);
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <div>
        <h2 className="text-2xl font-bold">
          {customer ? "Edit Customer" : "Add Customer"}
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
