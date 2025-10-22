import Form from "next/form";
import { Input } from "@/components/ui/input";
import SearchButton from "@/components/searchButton";

export default function SearchCustomer() {
  return (
    <Form action="/customers" className="flex gap-2 items-center ">
      <Input
        name="SearchText"
        type="text"
        placeholder="Search Customers"
        className="w-full"
      />
      <SearchButton />
    </Form>
  );
}
