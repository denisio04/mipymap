import Image from "next/image";
import { formatCUP, isOpenNow } from "@/lib/utils";
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
  delivery: boolean;
  phone: string | null;
  openingTime: string | null;
  closingTime: string | null;
  mipymeLat: number;
  mipymeLng: number;
  products: GroupedProduct[];
}

export function MipymeResultCard({
  mipymeId,
  mipymeName,
  mipymeImage,
  acceptsTransfer,
  delivery,
  phone,
  openingTime,
  closingTime,
  mipymeLat,
  mipymeLng,
  products,
  showProducts = false,
}: MipymeResultCardProps & { showProducts?: boolean }) {
  const open = isOpenNow(openingTime, closingTime);

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
          <div className="flex items-center gap-2 mt-0.5">
            {acceptsTransfer && (
              <span className="text-[10px] font-medium text-foreground border border-border-light px-1.5 py-0.5 inline-block">
                Acepta Transferencia
              </span>
            )}
            {delivery && (
              <span className="text-[10px] font-medium text-accent border border-accent px-1.5 py-0.5 inline-block">
                Domicilio{phone ? ` (${phone})` : ""}
              </span>
            )}
            {openingTime && closingTime && (
              <span className="text-[10px]" style={{ color: open ? "#22c55e" : "#ef4444" }}>
                {openingTime} - {closingTime} {open ? "★" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product list */}
      {showProducts && products.length > 0 && (
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
      )}
    </Link>
  );
}
