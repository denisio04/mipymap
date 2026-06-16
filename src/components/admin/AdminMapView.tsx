'use client';

import { useState, useCallback } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CIENFUEGOS_CENTER, DEFAULT_ZOOM } from '@/lib/constants';
import { CreateMipymeModal } from './CreateMipymeModal';
import type { MipymeWithProducts } from '@/types';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function AdminMapView({ mipymes }: { mipymes: MipymeWithProducts[] }) {
  const [modal, setModal] = useState<{ lat: number; lng: number } | null>(null);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setModal({ lat, lng });
  }, []);

  return (
    <>
      <LeafletMap
        center={[CIENFUEGOS_CENTER.lat, CIENFUEGOS_CENTER.lng]}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <ClickHandler onClick={handleMapClick} />
        {mipymes.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} />
        ))}
      </LeafletMap>
      {modal && (
        <CreateMipymeModal
          lat={modal.lat}
          lng={modal.lng}
          onCloseAction={() => setModal(null)}
        />
      )}
    </>
  );
}
