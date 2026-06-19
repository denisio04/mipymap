import { prisma } from '@/lib/prisma';
import { ToggleMapSection } from '@/components/admin/ToggleMapSection';
import { MipymeList } from '@/components/admin/MipymeList';

export default async function AdminPage() {
  const mipymes = await prisma.mipyme.findMany({
    include: {
      products: { select: { id: true, name: true, quantity: true, price: true } },
      user: { select: { username: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <ToggleMapSection mipymes={JSON.parse(JSON.stringify(mipymes))} />
      <section>
        <MipymeList mipymes={JSON.parse(JSON.stringify(mipymes))} />
      </section>
    </div>
  );
}
