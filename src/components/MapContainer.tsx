'use client';

import dynamic from 'next/dynamic';
import type { MipymeWithProducts } from '@/types';

const MapView = dynamic(() => import('@/components/MapView').then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-muted text-sm">
      Cargando mapa...
    </div>
  ),
});

export function MapContainer({
  mipymes,
  selectedMipymeId,
  flyToLat,
  flyToLng,
}: {
  mipymes: MipymeWithProducts[];
  selectedMipymeId?: string | null;
  flyToLat?: number | null;
  flyToLng?: number | null;
}) {
  return (
    <MapView
      mipymes={mipymes}
      selectedMipymeId={selectedMipymeId}
      flyToLat={flyToLat}
      flyToLng={flyToLng}
    />
  );
}
