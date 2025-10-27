import { Column } from "@tanstack/react-table";
import { DebouncedInput } from "./debouncedInput";

type Props<T> = {
  column: Column<T, unknown>;
};

export function Filter<T>({ column }: Props<T>) {
  const columnFilterValue = column.getFilterValue();

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search... (${
        [...column.getFacetedUniqueValues()].filter((arr) => arr[0]).length
      })`}
      className="w-full border rounded bg-card"
    />
  );
}
