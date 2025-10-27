"use client";

import type { getTicketSearchResultsType } from "@/lib/queries/getTicketSearchResults";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  CircleCheckIcon,
  CircleXIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Filter } from "@/components/react-table/Filter";

type Props = {
  data: getTicketSearchResultsType;
};

type RowType = getTicketSearchResultsType[0] & { id: number };

export default function TicketTable({ data }: Props) {
  const router = useRouter();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "TicketDate",
      desc: false, //false for ascending
    },
  ]);

  const columnHeadersArray: Array<keyof RowType> = [
    "TicketDate",
    "Title",
    "FirstName",
    "LastName",
    "Email",
    "Tech",
    "Completed",
  ];

  const columnHelper = createColumnHelper<RowType>();

  const columns = columnHeadersArray.map((columnName) => {
    return columnHelper.accessor(
      (row) => {
        const value = row[columnName];
        if (columnName === "TicketDate" && value instanceof Date) {
          return value.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        }

        if (columnName === "Completed") {
          return value ? "COMPLETED" : "OPEN";
        }

        return value;
      },
      {
        id: columnName,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="pl-1 w-full flex justify-between"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {columnName[0].toUpperCase() + columnName.slice(1)}
              {column.getIsSorted() === "asc" && (
                <ArrowUp className="ml-2 h-4 w-4 " />
              )}
              {column.getIsSorted() === "desc" && (
                <ArrowDown className="ml-2 h-4 w-4 " />
              )}
              {column.getIsSorted() !== "desc" &&
                column.getIsSorted() !== "asc" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 " />
                )}
            </Button>
          );
        },
        cell: ({ getValue }) => {
          const value = getValue();

          if (columnName === "Completed") {
            return (
              <div className="grid place-content-center">
                {value === "OPEN" ? (
                  <CircleXIcon className="opacity-25" />
                ) : (
                  <CircleCheckIcon className="text-green-600" />
                )}
              </div>
            );
          }

          return value;
        },
      }
    );
  });

  const table = useReactTable<RowType>({
    data: data as RowType[],
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mt-6 gap-4 flex flex-col">
      <div className="mt-6 rounded-lg overflow-hidden border border-border">
        <Table className="border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-secondary p-1">
                    <div>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </div>
                    {header.column.getCanFilter() ? (
                      <div className="grid place-content-center">
                        <Filter column={header.column} />
                      </div>
                    ) : null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40"
                onClick={() => {
                  if (row.original.id) {
                    router.push(`/tickets/form?ticketId=${row.original.id}`);
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center px-4">
        <div className="flex basis-1/3 items-center">
          <p className="whitespace-nowrap font-bold">
            {`Page ${
              table.getState().pagination.pageIndex + 1
            } of ${table.getPageCount()}`}
            &nbsp;&nbsp;
            {`[${table.getFilteredRowModel().rows.length} ${
              table.getFilteredRowModel().rows.length !== 1
                ? " total results"
                : " result"
            }]`}
          </p>
        </div>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => table.resetSorting()}>
            Clear sorting
          </Button>
          <Button variant="outline" onClick={() => table.resetColumnFilters()}>
            Clear filters
          </Button>
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
