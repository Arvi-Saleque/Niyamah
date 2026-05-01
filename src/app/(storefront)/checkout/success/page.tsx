import { redirect } from "next/navigation";
import { OrderConfirmation } from "@/components/storefront/order-confirmation";

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export const metadata = { title: "Order confirmed" };

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { orderId } = await searchParams;
  if (!orderId) redirect("/");

  return (
    <div className="container mx-auto max-w-2xl px-4">
      <OrderConfirmation orderId={orderId} />
    </div>
  );
}
