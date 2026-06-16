import { prisma } from '@/lib/prisma';

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  await prisma.mipyme.update({
    where: { id },
    data: { interactions: { increment: 1 } },
  });
  return Response.json({ ok: true });
}
