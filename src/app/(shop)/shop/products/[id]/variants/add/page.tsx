import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ShopProductVariantAdd(props: PageProps) {
  const { id } = await props.params;
  redirect(`/shop/products/${id}`);
}

