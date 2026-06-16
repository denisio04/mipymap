'use server';

import { prisma } from '@/lib/prisma';
import type { SearchResult } from '@/types';

export async function searchProducts(query: string): Promise<SearchResult[]> {
  if (query.length < 1) return [];

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
      },
      quantity: { gt: 0 },
    },
    include: {
      mipyme: {
        select: {
          id: true,
          name: true,
          acceptsTransfer: true,
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
    mipymeImage: p.mipyme.image,
    mipymeLat: p.mipyme.lat,
    mipymeLng: p.mipyme.lng,
  }));
}
