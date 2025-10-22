import SearchCustomer from "./CustomerSearch";
import { getCustomerSearchResults } from "@/lib/queries/getCustomerSearchResults";

export const metadata = {
  title: "Customer Search",
};

export default async function Customers({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const SearchText = searchParams.SearchText;

  if (!SearchText) return <SearchCustomer />;

  const results = await getCustomerSearchResults(SearchText);

  return (
    <>
      <SearchCustomer />
      <p>{JSON.stringify(results)}</p>
    </>
  );
}
