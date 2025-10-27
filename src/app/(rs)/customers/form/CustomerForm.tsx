"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { CheckBoxWithLabel } from "@/components/inputs/CheckBoxWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import {
  customerInsertSchema,
  type InsertCustomerSchemaType,
  type SelectCustomerSchemaType,
} from "@/zod-schemas/customer";
import { useAction } from "next-safe-action/hooks";
import { saveCustomerAction } from "@/app/actions/saveCustomerActions";
import { DisplayServerActionResult } from "@/components/displayServerActionResponse";

type props = {
  customer?: SelectCustomerSchemaType | null;
};

export function CustomerForm({ customer }: props) {
  const { getPermission, isLoading } = useKindeBrowserClient();
  const isManager = !isLoading && getPermission("manager")?.isGranted;

  const defaultValues: InsertCustomerSchemaType = {
    id: customer?.id ?? 0,
    firstName: customer?.firstName ?? "",
    lastName: customer?.lastName ?? "",
    email: customer?.email.toLocaleLowerCase() ?? "",
    phone: customer?.phone ?? "",
    address: customer?.address ?? "",
    active: customer?.active ?? true,
  };

  const form = useForm<InsertCustomerSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(customerInsertSchema),
    defaultValues,
  });

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction,
  } = useAction(saveCustomerAction, {
    onSuccess({ data }) {
      if (data?.message) {
        //toast the user
        toast.success("Success! 🎉", { description: data.message });
      }
    },
    onError({ error }) {
      //toast the user to display the error
      toast.error("Error!", { description: "Failed to save!" });
    },
  });

  async function submitForm(data: InsertCustomerSchemaType) {
    // console.log(data);
    executeSave(data);
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <DisplayServerActionResult result={saveResult} />
      <div>
        <h2 className="text-2xl font-bold">
          {customer ? "Edit Customer" : "Add Customer"}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col md:flex-row gap-4 md:gap-8"
        >
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <InputWithLabel<InsertCustomerSchemaType>
              fieldTitle="First Name"
              nameInSchema="firstName"
              placeholder="First Name"
            />
            <InputWithLabel<InsertCustomerSchemaType>
              fieldTitle="Last Name"
              nameInSchema="lastName"
              placeholder="Last Name"
            />
            <InputWithLabel<InsertCustomerSchemaType>
              fieldTitle="Email"
              nameInSchema="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div>
            <InputWithLabel<InsertCustomerSchemaType>
              fieldTitle="Phone"
              nameInSchema="phone"
              placeholder="Phone"
            />
            <InputWithLabel<InsertCustomerSchemaType>
              fieldTitle="Address"
              nameInSchema="address"
              placeholder="Address"
            />
            <TextAreaWithLabel<InsertCustomerSchemaType>
              fieldTitle="Notes"
              nameInSchema="notes"
              placeholder="Notes"
              className="h-20"
              // show existing notes only when editing an existing customer
              defaultValue={customer?.id ? customer?.notes ?? "" : undefined}
            />
            {isLoading ? (
              <p>Loading...</p>
            ) : isManager && customer?.id ? (
              <div className="mt-2">
                <CheckBoxWithLabel<InsertCustomerSchemaType>
                  fieldTitle="Active"
                  nameInSchema="active"
                  message="yes"
                />
              </div>
            ) : null}

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
          </div>
        </form>
      </Form>
    </div>
  );
}
