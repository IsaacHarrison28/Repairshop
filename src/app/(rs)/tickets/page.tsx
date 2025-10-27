import { Metadata } from "next";
import SearchTicket from "./TicketSearch";
import { getTicketSearchResults } from "@/lib/queries/getTicketSearchResults";
import { getOpenTickets } from "@/lib/queries/getOpenTickets";
import TicketTable from "@/app/(rs)/tickets/TicketTable";

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
        {results.length ? <TicketTable data={results} /> : null}
      </>
    );
  }

  const results = await getTicketSearchResults(SearchText);

  return (
    <>
      <SearchTicket />
      {results.length ? <TicketTable data={results} /> : null}
    </>
  );
}
