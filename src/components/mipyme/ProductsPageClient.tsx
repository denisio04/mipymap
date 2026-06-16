'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { ProductList } from './ProductList';
import Link from 'next/link';

interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export function ProductsPageClient({
  products,
  userId,
}: {
  products: ProductItem[];
  userId: string;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-semibold text-sm whitespace-nowrap">Mis Productos</h2>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-border-light bg-background text-foreground focus:outline-none focus:border-accent"
          />
        </div>
        <Link href="/mipyme">
          <p className="border border-border px-3 py-1 text-sm whitespace-nowrap">Volver</p>
        </Link>
      </div>

      <ProductList
        products={products}
        userId={userId}
        searchQuery={searchQuery}
      />
    </div>
  );
}
