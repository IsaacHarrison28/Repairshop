export const dynamic = "force-dynamic";
import { getCustomer } from "@/lib/queries/getCustomer";
import { BackButton } from "@/components/backButton";
import * as Sentry from "@sentry/nextjs";
import { CustomerForm } from "@/app/(rs)/customers/form/CustomerForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { customerId } = searchParams;
  const title = customerId ? `Edit Customer #${customerId}` : "New Customer";

  return { title };
}

export default async function customerFormPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  try {
    const { getPermission } = getKindeServerSession();
    const managerPermission = await getPermission("manager");
    const isManager = managerPermission?.isGranted;

    const { customerId } = searchParams; // ❌ remove await

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

      return (
        <CustomerForm
          key={customerId}
          isManager={isManager}
          customer={customer}
        />
      );
    } else {
      return <CustomerForm key="new" isManager={isManager} />;
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      throw new Error(error.message);
    }
  }
}
