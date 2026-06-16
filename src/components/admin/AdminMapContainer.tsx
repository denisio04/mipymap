'use client';

import dynamic from 'next/dynamic';
import type { MipymeWithProducts } from '@/types';

const AdminMapView = dynamic(() => import('./AdminMapView').then((m) => m.AdminMapView), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-muted text-sm">
      Cargando mapa...
    </div>
  ),
});

export function AdminMapContainer({ mipymes }: { mipymes: MipymeWithProducts[] }) {
  return <AdminMapView mipymes={mipymes} />;
}
