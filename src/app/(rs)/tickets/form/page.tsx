import { BackButton } from "@/components/backButton";
import { getTicket } from "@/lib/queries/getTicket";
import { getCustomer } from "@/lib/queries/getCustomer";
import * as Sentry from "@sentry/nextjs";
import TicketForm from "../form/TicketForm";

export default async function ticketFormPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  try {
    const { ticketId, customerId } = await searchParams;

    if (!customerId && !ticketId) {
      return (
        <>
          <h2 className="text-2xl">No customer or ticket ID provided!</h2>
          <BackButton title="Go back" variant="outline" className="mt-4" />
        </>
      );
    }

    //New ticket form

    if (customerId) {
      const customer = await getCustomer(Number(customerId));
      if (!customer) {
        return (
          <>
            <h2 className="text-2xl">Customer of ID {customerId} not found!</h2>
            <BackButton title="Go back" variant="outline" className="mt-4" />
          </>
        );
      }

      if (!customer.active) {
        return (
          <>
            <h2 className="text-2xl">
              Customer of ID {customerId} is inactive!
            </h2>
            <BackButton title="Go back" variant="outline" className="mt-4" />
          </>
        );
      }

      console.log(customer);
      return <TicketForm customer={customer} />;
    }

    if (ticketId) {
      const ticket = await getTicket(Number(ticketId));
      if (!ticket) {
        return (
          <>
            <h2 className="text-2xl">Ticket of ID {ticketId} not found!</h2>

            <BackButton title="Go back" variant="outline" className="mt-4" />
          </>
        );
      }

      const customer = await getCustomer(ticket.customerId);

      //return ticket form with customer data
      console.log("ticket", ticket);
      console.log("customer", customer);

      return <TicketForm ticket={ticket} customer={customer} />;
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      throw new Error(error.message);
    }
  }
}
