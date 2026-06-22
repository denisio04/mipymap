"use server";

import { prisma } from "@/lib/prisma";
import type { SearchResult } from "@/types";

export async function searchProducts(query: string): Promise<SearchResult[]> {
  const where =
    query.length < 1
      ? { active: true } // sin búsqueda → todos los productos activos
      : {
          name: { contains: query },
          active: true,
        };

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      mipyme: {
        select: {
          id: true,
          name: true,
          acceptsTransfer: true,
          delivery: true,
          phone: true,
          openingTime: true,
          closingTime: true,
          image: true,
          lat: true,
          lng: true,
        },
      },
    },
    take: 5000,
  });

  return products.map((p) => ({
    productId: p.id,
    productName: p.name,
    price: p.price,
    mipymeId: p.mipyme.id,
    mipymeName: p.mipyme.name,
    acceptsTransfer: p.mipyme.acceptsTransfer,
    delivery: p.mipyme.delivery,
    phone: p.mipyme.phone,
    openingTime: p.mipyme.openingTime,
    closingTime: p.mipyme.closingTime,
    mipymeImage: p.mipyme.image,
    mipymeLat: p.mipyme.lat,
    mipymeLng: p.mipyme.lng,
  }));
}
