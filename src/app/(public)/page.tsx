import { prisma } from '@/lib/prisma';
import { MapContainer } from '@/components/MapContainer';

export default async function HomePage(props: {
  searchParams?: Promise<{ mipyme?: string; lat?: string; lng?: string }>;
}) {
  const searchParams = await props.searchParams;
  const selectedId = searchParams?.mipyme ?? null;
  const selectedLat = searchParams?.lat ? Number(searchParams.lat) : null;
  const selectedLng = searchParams?.lng ? Number(searchParams.lng) : null;

  const mipymes = await prisma.mipyme.findMany({
    include: {
      products: {
        where: { active: true },
        select: { id: true, name: true, price: true },
      },
    },
  });

  return (
    <div className="h-dvh w-full -mt-14">
      <MapContainer
        mipymes={JSON.parse(JSON.stringify(mipymes))}
        selectedMipymeId={selectedId}
        flyToLat={selectedLat}
        flyToLng={selectedLng}
      />
    </div>
  );
}
