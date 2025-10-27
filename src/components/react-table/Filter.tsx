"use client";

import { Column } from "@tanstack/react-table";
import { DebouncedInput } from "@/components/react-table/debouncedInput";

type Props<T> = {
  column: Column<T, unknown>;
};

export function Filter<T>({ column }: Props<T>) {
  const columnFilterValue = column.getFilterValue();
  const sortedUniqueValues = Array.from(
    column.getFacetedUniqueValues().keys()
  ).sort();

  return (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value, i) => (
          <option value={value} key={`${i}-${column.id}`} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${
          [...column.getFacetedUniqueValues()].filter((arr) => arr[0]).length
        })`}
        className="w-full border rounded bg-card"
        list={column.id + "list"}
      />
    </>
  );
}
