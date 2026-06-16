"use client";

import { useState, useRef } from "react";
import { X, Search } from "lucide-react";
import { formatCUP } from "@/lib/utils";
import type { MipymeWithProducts } from "@/types";

export function ProductModal({
  mipyme,
  onCloseAction,
}: {
  mipyme: MipymeWithProducts;
  onCloseAction: () => void;
}) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? mipyme.products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
      )
    : mipyme.products;

  function toggleSearch() {
    if (searchOpen) {
      setQuery("");
      setSearchOpen(false);
    } else {
      setSearchOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  return (
    <div className="fixed inset-0 z-9999 bg-black/60 flex items-end sm:items-center justify-center">
      <div
        className="w-full max-w-sm mx-auto max-h-[70vh] overflow-y-auto border border-[#334155]"
        style={{ background: "rgba(15, 23, 42, 0.97)" }}
      >
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-base">{mipyme.name}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSearch}
                className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={onCloseAction}
                className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="relative mb-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#334155] bg-#0f172a text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          {mipyme.products.length === 0 ? (
            <p className="text-sm text-muted">Sin productos registrados</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted">
              Ese producto no está disponible
            </p>
          ) : (
            <ul className="space-y-3">
              {filtered.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                  </div>
                  <p className="font-semibold whitespace-nowrap">
                    {formatCUP(p.price)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
