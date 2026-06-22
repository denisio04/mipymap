"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { updateProduct } from "@/app/actions/mipyme";
import { useRouter } from "next/navigation";

export function EditProductModal({
  product,
  onCloseAction,
  userId,
}: {
  product: { id: string; name: string; price: number; active: boolean };
  onCloseAction: () => void;
  userId: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [active, setActive] = useState(product.active);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) {
      setError("Todos los campos son requeridos");
      return;
    }
    const prc = parseFloat(price);
    if (isNaN(prc) || prc < 0) {
      setError("Precio inválido");
      return;
    }

    setLoading(true);
    setError("");
    const res = await updateProduct(
      product.id,
      { name, price: prc, active },
      userId,
    );
    if (res.success) {
      router.refresh();
      onCloseAction();
    } else {
      setError(res.error || "Error");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-9999 bg-black/60 flex items-end sm:items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-surface w-full max-w-sm mx-auto p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm">Editar Producto</h2>
          <button
            type="button"
            onClick={onCloseAction}
            className="text-muted-foreground cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm border border-border-light bg-background text-foreground focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-muted-foreground cursor-pointer" htmlFor="product-active">
              Producto Activo
            </label>
            <button
              id="product-active"
              type="button"
              role="switch"
              aria-checked={active}
              onClick={() => setActive(!active)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
                active
                  ? "border-accent bg-accent"
                  : "border-border-light bg-surface"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-background transition-transform ${
                  active ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">
              Precio (CUP)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm border border-border-light bg-background text-foreground focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {error && <p className="text-xs text-danger mt-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-2.5 text-sm font-medium text-background bg-accent cursor-pointer disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
