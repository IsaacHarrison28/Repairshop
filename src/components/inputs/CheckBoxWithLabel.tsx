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
};

export function CheckBoxWithLabel<S>({
  fieldTitle,
  nameInSchema,
  message,
  ...props
}: props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className="w-full flex items-center gap-2">
          <FormLabel className="text-base w-1/3 mt-2" htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>

          <div className="flex items-center gap-2">
            <FormControl>
              <Checkbox
                id={nameInSchema}
                {...field}
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            {message}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
