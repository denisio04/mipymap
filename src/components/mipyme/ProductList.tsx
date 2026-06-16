'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateProductModal } from './CreateProductModal';
import { EditProductModal } from './EditProductModal';
import { DeleteProductConfirm } from './DeleteProductConfirm';
import { StockModal } from './StockModal';

interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export function ProductList({ products, userId, searchQuery }: { products: ProductItem[]; userId: string; searchQuery?: string }) {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<ProductItem | null>(null);
  const [deleting, setDeleting] = useState<ProductItem | null>(null);
  const [stockAdjust, setStockAdjust] = useState<{
    product: ProductItem;
    mode: 'increase' | 'decrease';
  } | null>(null);

  const filtered = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products;

  return (
    <>
      <button
        onClick={() => setCreating(true)}
        className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium border border-border-light text-foreground mb-4 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Agregar Producto
      </button>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted py-8 text-center">
          {searchQuery ? 'No se encontraron productos' : 'No tienes productos registrados'}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="border border-border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {p.quantity} en inventario
                  </p>
                </div>
                <p className="font-semibold text-sm">{(p.price).toFixed(2)} CUP</p>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setEditing(p)}
                  className="text-xs text-muted-foreground underline cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => setStockAdjust({ product: p, mode: 'increase' })}
                  className="text-xs text-accent underline cursor-pointer"
                >
                  + Stock
                </button>
                <button
                  onClick={() => setStockAdjust({ product: p, mode: 'decrease' })}
                  className="text-xs text-accent underline cursor-pointer"
                >
                  - Stock
                </button>
                <button
                  onClick={() => setDeleting(p)}
                  className="text-xs text-danger underline cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && <CreateProductModal onCloseAction={() => setCreating(false)} userId={userId} />}
      {editing && (
        <EditProductModal product={editing} onCloseAction={() => setEditing(null)} userId={userId} />
      )}
      {deleting && (
        <DeleteProductConfirm product={deleting} onCloseAction={() => setDeleting(null)} userId={userId} />
      )}
      {stockAdjust && (
        <StockModal
          product={stockAdjust.product}
          mode={stockAdjust.mode}
          onCloseAction={() => setStockAdjust(null)}
          userId={userId}
        />
      )}
      </>
  );
}
