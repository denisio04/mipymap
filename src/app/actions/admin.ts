'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function createMipyme(data: {
  name: string;
  password: string;
  acceptsTransfer: boolean;
  province: string;
  municipality: string;
  lat: number;
  lng: number;
  image?: string | null;
}) {
  const existing = await prisma.user.findUnique({ where: { username: data.name } });
  if (existing) {
    return { success: false, error: 'Este nombre de mipyme ya existe' };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      username: data.name,
      password: hashedPassword,
      role: 'MIPYME',
      mipyme: {
        create: {
          name: data.name,
          lat: data.lat,
          lng: data.lng,
          acceptsTransfer: data.acceptsTransfer,
          province: data.province,
          municipality: data.municipality,
          image: data.image ?? null,
        },
      },
    },
  });

  return { success: true, userId: user.id };
}

export async function updateMipyme(
  id: string,
  data: {
    name: string;
    acceptsTransfer: boolean;
    province: string;
    municipality: string;
    image?: string | null;
    password?: string | null;
  },
) {
  const { password, ...mipymeData } = data;

  if (password) {
    const mipyme = await prisma.mipyme.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (mipyme) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: mipyme.userId },
        data: { password: hashedPassword },
      });
    }
  }

  await prisma.mipyme.update({
    where: { id },
    data: mipymeData,
  });
  return { success: true };
}

export async function deleteMipyme(id: string) {
  await prisma.mipyme.delete({ where: { id } });
  return { success: true };
}

export async function createAdmin(data: {
  username: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({ where: { username: data.username } });
  if (existing) {
    return { success: false, error: 'Este nombre de usuario ya existe' };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  return { success: true };
}

export async function resetMipymeCountdown(id: string) {
  await prisma.mipyme.update({
    where: { id },
    data: { createdAt: new Date() },
  });
  return { success: true };
}
