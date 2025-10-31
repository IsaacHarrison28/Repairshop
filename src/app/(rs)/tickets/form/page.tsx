import { BackButton } from "@/components/backButton";
import { getTicket } from "@/lib/queries/getTicket";
import { getCustomer } from "@/lib/queries/getCustomer";
import * as Sentry from "@sentry/nextjs";
import TicketForm from "../form/TicketForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Users, init as KindeInit } from "@kinde/management-api-js";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { ticketId, customerId } = resolvedSearchParams;

  if (customerId) {
    return { title: "New Ticket Form" };
  }
  if (ticketId) {
    return { title: `Edit Ticket #${ticketId}` };
  }
  return { title: "Ticket Form" };
}

export default async function ticketFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const resolvedSearchParams = await searchParams;
    const { ticketId, customerId } = resolvedSearchParams;

    if (!customerId && !ticketId) {
      return (
        <>
          <h2 className="text-2xl">No customer or ticket ID provided!</h2>
          <BackButton title="Go back" variant="outline" className="mt-4" />
        </>
      );
    }

    const { getPermission, getUser } = getKindeServerSession();
    const [managerPermission, user] = await Promise.all([
      getPermission("manager"),
      getUser(),
    ]);

    const isManager = managerPermission?.isGranted;

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

      //return ticket form
      if (isManager) {
        //initialize the Kinde Management API
        KindeInit({
          kindeDomain: process.env.KINDE_DOMAIN!,
          clientId: process.env.KINDE_MANAGEMENT_CLIENT_ID!,
          clientSecret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET!,
        });

        const { users } = await Users.getUsers();

        const techs = users
          ? users.map((user) => ({
              id: user.email?.toLowerCase()!,
              description: user.email?.toLowerCase()!,
            }))
          : [];

        return (
          <TicketForm customer={customer} techs={techs} isManager={isManager} />
        );
      } else {
        return <TicketForm customer={customer} />;
      }
    }

    //Edit ticket form
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
      if (isManager) {
        KindeInit({
          kindeDomain: process.env.KINDE_DOMAIN!,
          clientId: process.env.KINDE_MANAGEMENT_CLIENT_ID!,
          clientSecret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET!,
        });
        const { users } = await Users.getUsers();

        const techs = users
          ? users.map((user) => ({ id: user.email!, description: user.email! }))
          : [];

        return (
          <TicketForm
            customer={customer}
            ticket={ticket}
            techs={techs}
            isManager={isManager}
          />
        );
      } else {
        const isEditable =
          user?.email?.toLowerCase() === ticket.tech.toLowerCase();
        return (
          <TicketForm
            customer={customer}
            ticket={ticket}
            isEditable={isEditable}
          />
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      throw error;
    } else {
      Sentry.captureException(error);
      throw new Error(String(error));
    }
  }
}
