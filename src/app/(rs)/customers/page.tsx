import SearchCustomer from "./CustomerSearch";
import { getCustomerSearchResults } from "@/lib/queries/getCustomerSearchResults";
import * as Sentry from "@sentry/nextjs";
import CustomerTable from "@/app/(rs)/customers/CustomerTable";

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

  const span = Sentry.startInactiveSpan({
    name: "getCustomerSearchResults-2",
  });
  const results = await getCustomerSearchResults(SearchText);
  span.end();
  return (
    <>
      <SearchCustomer />
      {results?.length ? (
        <CustomerTable data={results} />
      ) : (
        <p className="mt-4">No results found!</p>
      )}
    </>
  );
}
