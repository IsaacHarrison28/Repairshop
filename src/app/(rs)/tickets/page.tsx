import { Metadata } from "next";
import SearchTicket from "./TicketSearch";
import { getTicketSearchResults } from "@/lib/queries/getTicketSearchResults";
import { getOpenTickets } from "@/lib/queries/getOpenTickets";

export const metadata: Metadata = {
  title: "Search Ticket",
};

export default async function Tickets({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const SearchText = searchParams.SearchText;

  if (!SearchText) {
    const results = await getOpenTickets();
    return (
      <>
        <SearchTicket />
        <p>{JSON.stringify(results)}</p>
      </>
    );
  }

  const results = await getTicketSearchResults(SearchText);

  return (
    <>
      <SearchTicket />
      {results?.length === 0 ? (
        <p className="capitalize">No Ticket found matching the search</p>
      ) : (
        <p>{JSON.stringify(results)}</p>
      )}
    </>
  );
}
