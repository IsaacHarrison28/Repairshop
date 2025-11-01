import { getCustomer } from "@/lib/queries/getCustomer";
import { BackButton } from "@/components/backButton";
import * as Sentry from "@sentry/nextjs";
import { CustomerForm } from "@/app/(rs)/customers/form/CustomerForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId } = await searchParams;
  const title = customerId ? `Edit Customer #${customerId}` : "New Customer";

  return {
    title,
  };
}

export default async function customerFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    //getting manager permissions
    const { getPermission } = getKindeServerSession();
    const managerPermission = await getPermission("manager");
    const isManager = managerPermission?.isGranted;

    const { customerId } = await searchParams;

    //edit customer
    if (customerId) {
      const customer = await getCustomer(Number(customerId));
      if (!customer) {
        return (
          <>
            <h2 className="text-2xl">Customer of ID {customerId} not found!</h2>

            <BackButton title="Go back" variant="outline" className="mt-4" />
          </>
        );
        throw new Error("Customer not found");
      }

      return (
        <CustomerForm
          key={customerId}
          isManager={isManager}
          customer={customer}
        />
      );
    } else {
      //new customer form component
      return <CustomerForm key="new" isManager={isManager} />;
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      throw new Error(error.message);
    }
  }
}
