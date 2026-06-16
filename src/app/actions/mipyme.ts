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
  data: { name: string; quantity: number; price: number },
  userId: string
) {
  const mipyme = await prisma.mipyme.findUnique({ where: { userId } });
  if (!mipyme) return { success: false, error: 'Mipyme no encontrada' };

  await prisma.product.create({
    data: {
      name: data.name,
      quantity: data.quantity,
      price: data.price,
      mipymeId: mipyme.id,
    },
  });
  return { success: true };
}

export async function updateProduct(
  id: string,
  data: { name: string; quantity: number; price: number },
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
    data: { name: data.name, quantity: data.quantity, price: data.price },
  });
  return { success: true };
}

export async function adjustStock(
  id: string,
  delta: number,
  userId: string
) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { mipyme: { select: { userId: true } } },
  });
  if (!product || product.mipyme.userId !== userId) {
    return { success: false, error: 'No autorizado' };
  }

  const newQuantity = Math.max(0, product.quantity + delta);
  await prisma.product.update({
    where: { id },
    data: { quantity: newQuantity },
  });
  return { success: true, newQuantity };
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
