
import ProductPage from "@/components/template/ProductPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  return {
    title: `${slug} | NOIR`,
    description: "Discover this fragrance from the NOIR collection.",
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  return <ProductPage slug={slug} />;
}
