'use server';

import { prisma } from '@/lib/prisma';
import type { SearchResult } from '@/types';

export async function searchProducts(query: string): Promise<SearchResult[]> {
  const where =
    query.length < 1
      ? { quantity: { gt: 0 } } // sin búsqueda → todos los productos en stock
      : {
          name: { contains: query },
          quantity: { gt: 0 },
        };

  const products = await prisma.product.findMany({
    where,
    include: {
      mipyme: {
        select: {
          id: true,
          name: true,
          acceptsTransfer: true,
          openingTime: true,
          closingTime: true,
          image: true,
          lat: true,
          lng: true,
        },
      },
    },
    take: 50,
  });

  return products.map((p) => ({
    productId: p.id,
    productName: p.name,
    quantity: p.quantity,
    price: p.price,
    mipymeId: p.mipyme.id,
    mipymeName: p.mipyme.name,
    acceptsTransfer: p.mipyme.acceptsTransfer,
    openingTime: p.mipyme.openingTime,
    closingTime: p.mipyme.closingTime,
    mipymeImage: p.mipyme.image,
    mipymeLat: p.mipyme.lat,
    mipymeLng: p.mipyme.lng,
  }));
}
