'use server';

import { prisma } from '@/lib/prisma';

export async function getMyMipyme(userId: string) {
  return prisma.mipyme.findUnique({
    where: { userId },
  });
}

export async function getMyProducts(userId: string) {
  const mipyme = await prisma.mipyme.findUnique({
    where: { userId },
    include: {
      products: { orderBy: { createdAt: 'desc' } },
    },
  });
  return mipyme?.products || [];
}

export async function createProduct(
  data: { name: string; price: number },
  userId: string
) {
  const mipyme = await prisma.mipyme.findUnique({ where: { userId } });
  if (!mipyme) return { success: false, error: 'Mipyme no encontrada' };

  await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      active: true,
      mipymeId: mipyme.id,
    },
  });
  return { success: true };
}

export async function updateProduct(
  id: string,
  data: { name: string; price: number; active: boolean },
  userId: string
) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { mipyme: { select: { userId: true } } },
  });
  if (!product || product.mipyme.userId !== userId) {
    return { success: false, error: 'No autorizado' };
  }

  await prisma.product.update({
    where: { id },
    data: { name: data.name, price: data.price, active: data.active },
  });
  return { success: true };
}

export async function deleteProduct(id: string, userId: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { mipyme: { select: { userId: true } } },
  });
  if (!product || product.mipyme.userId !== userId) {
    return { success: false, error: 'No autorizado' };
  }

  await prisma.product.delete({ where: { id } });
  return { success: true };
}
