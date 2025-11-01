import Form from "next/form";
import { Input } from "@/components/ui/input";
import SearchButton from "@/components/searchButton";

export default function SearchTicket() {
  return (
    <Form action="/tickets" className="flex gap-2 items-center ">
      <Input
        name="SearchText"
        type="text"
        placeholder="Search Tickets"
        className="w-full"
        autoFocus
      />
      <SearchButton />
    </Form>
  );
}
