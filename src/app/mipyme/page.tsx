import Link from "next/link";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Package } from "lucide-react";
import { LiveCounter } from "@/components/mipyme/LiveCounter";

export default async function MipymeDashboard() {
  const session = await getServerSession();
  const mipyme = await prisma.mipyme.findUnique({
    where: { userId: session!.user.id },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="border border-border p-4">
        <div className="flex ">
          <h2 className="font-semibold text-sm mb-2">{mipyme?.name}</h2>
          <div>
            {mipyme && (
              <LiveCounter mipymeId={mipyme.id} initial={mipyme.interactions} />
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {mipyme?.acceptsTransfer
            ? "Acepta Transferencia"
            : "No acepta Transferencia"}
        </p>
      </div>

      <Link
        href="/mipyme/productos"
        className="flex items-center justify-between border border-border p-4"
      >
        <div>
          <p className="font-semibold text-sm">Productos</p>
          <p className="text-xs text-muted mt-0.5">
            {mipyme?._count.products} registrados
          </p>
        </div>
        <Package className="w-5 h-5 text-muted" />
      </Link>
    </div>
  );
}
