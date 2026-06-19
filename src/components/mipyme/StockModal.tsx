"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { adjustStock } from "@/app/actions/mipyme";
import { useRouter } from "next/navigation";

export function StockModal({
  product,
  mode,
  onCloseAction,
  userId,
}: {
  product: { id: string; name: string; quantity: number };
  mode: "increase" | "decrease";
  onCloseAction: () => void;
  userId: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isIncrease = mode === "increase";
  const title = isIncrease ? "Aumentar Stock" : "Restar Stock";
  const actionLabel = isIncrease ? "Aumentar" : "Restar";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const qty = parseInt(amount, 10);
    if (isNaN(qty) || qty <= 0) {
      setError("Ingresa una cantidad válida mayor que 0");
      return;
    }
    if (!isIncrease && qty > product.quantity) {
      setError(`Solo hay ${product.quantity} en inventario`);
      return;
    }

    setLoading(true);
    setError("");
    const delta = isIncrease ? qty : -qty;
    const res = await adjustStock(product.id, delta, userId);
    if (res.success) {
      router.refresh();
      onCloseAction();
    } else {
      setError(res.error || "Error");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-9999 bg-black/60 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-surface w-full max-w-sm mx-auto p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm">{title}</h2>
          <button
            type="button"
            onClick={onCloseAction}
            className="text-muted-foreground cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm mb-1">
          <strong>{product.name}</strong>
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Stock actual: {product.quantity}
        </p>

        <div>
          <label className="text-xs text-muted-foreground">
            {isIncrease ? "Cantidad a aumentar" : "Cantidad a restar"}
          </label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full mt-1 px-3 py-2 text-sm border border-border-light bg-background text-foreground focus:outline-none focus:border-accent"
            autoFocus
          />
        </div>

        {error && <p className="text-xs text-danger mt-3">{error}</p>}

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onCloseAction}
            className="flex-1 py-2.5 text-sm border border-border-light text-foreground cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-medium text-background bg-accent cursor-pointer disabled:opacity-50"
          >
            {loading ? "Guardando..." : actionLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
