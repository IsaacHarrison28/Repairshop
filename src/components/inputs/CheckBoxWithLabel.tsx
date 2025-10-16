"use client";

import { useFormContext, Field } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";

type props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  message: string;
  disabled?: boolean;
};

export function CheckBoxWithLabel<S>({
  fieldTitle,
  nameInSchema,
  message,
  disabled = false,
  ...props
}: props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className="w-full flex items-center gap-4">
          <FormLabel className="text-base w-1/3" htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>
          <FormControl>
            <Checkbox
              id={nameInSchema}
              {...field}
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <span className="text-sm">{message}</span>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
