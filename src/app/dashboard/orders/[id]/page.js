import OrderDetailsPage from "@/components/template/order-details";

export default async function Page({ params }) {
  const { id } = await params;

  return <OrderDetailsPage orderId={id} />;
}