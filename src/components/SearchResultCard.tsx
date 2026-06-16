import { formatCUP } from "@/lib/utils";
import type { SearchResult } from "@/types";

export function SearchResultCard({ result }: { result: SearchResult }) {
  return (
    <div className="border border-border p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-sm">{result.productName}</p>
          <p className="text-xs text-muted mt-0.5">{result.mipymeName}</p>
        </div>
        <p className="font-semibold text-sm whitespace-nowrap ml-4">
          {formatCUP(result.price)}
        </p>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs">
        {result.acceptsTransfer && (
          <span className="text-xs font-medium text-foreground border border-border-light px-2 py-0.5">
            Acepta Transferencia
          </span>
        )}
      </div>
    </div>
  );
}
