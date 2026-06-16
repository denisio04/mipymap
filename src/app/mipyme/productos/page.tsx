import { getServerSession } from "@/lib/auth";
import { getMyProducts } from "@/app/actions/mipyme";
import { ProductsPageClient } from "@/components/mipyme/ProductsPageClient";

export default async function MipymeProductosPage() {
  const session = await getServerSession();
  const products = await getMyProducts(session!.user.id);

  return (
    <div>
      <ProductsPageClient
        products={JSON.parse(JSON.stringify(products))}
        userId={session!.user.id}
      />
    </div>
  );
}
