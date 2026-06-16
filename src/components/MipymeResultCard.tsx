import Image from "next/image";
import { formatCUP } from "@/lib/utils";
import Link from "next/link";

interface GroupedProduct {
  productId: string;
  productName: string;
  price: number;
}

interface MipymeResultCardProps {
  mipymeId: string;
  mipymeName: string;
  mipymeImage: string | null;
  acceptsTransfer: boolean;
  mipymeLat: number;
  mipymeLng: number;
  products: GroupedProduct[];
}

export function MipymeResultCard({
  mipymeId,
  mipymeName,
  mipymeImage,
  acceptsTransfer,
  mipymeLat,
  mipymeLng,
  products,
}: MipymeResultCardProps) {
  return (
    <Link
      href={`/?mipyme=${mipymeId}&lat=${mipymeLat}&lng=${mipymeLng}`}
      className="border border-border block cursor-pointer hover:border-accent transition-colors"
    >
      {/* Mipyme header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        {mipymeImage && (
          <div className="relative w-10 h-10 shrink-0 border border-border overflow-hidden">
            <Image
              src={mipymeImage}
              alt={mipymeName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{mipymeName}</p>
          {acceptsTransfer && (
            <span className="text-[10px] font-medium text-foreground border border-border-light px-1.5 py-0.5 inline-block mt-0.5">
              Acepta Transferencia
            </span>
          )}
        </div>
      </div>

      {/* Product list */}
      <div className="divide-y divide-border">
        {products.map((p) => (
          <div
            key={p.productId}
            className="flex items-center justify-between px-4 py-2.5"
          >
            <p className="text-sm text-muted-foreground">{p.productName}</p>
            <p className="text-sm font-semibold whitespace-nowrap ml-4">
              {formatCUP(p.price)}
            </p>
          </div>
        ))}
      </div>
    </Link>
  );
}
