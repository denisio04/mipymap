"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type MutableRefObject,
} from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { CIENFUEGOS_CENTER, DEFAULT_ZOOM } from "@/lib/constants";
import { CreateMipymeModal } from "./CreateMipymeModal";
import type { MipymeWithProducts } from "@/types";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapHandle({ mapRef }: { mapRef: MutableRefObject<L.Map | null> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

function LocateButton({
  tracking,
  onToggle,
  mapRef,
}: {
  tracking: boolean;
  onToggle: () => void;
  mapRef: MutableRefObject<L.Map | null>;
}) {
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleClick = useCallback(() => {
    if (!tracking) {
      if (!navigator.geolocation) {
        setGeoError("Geolocalización no disponible");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoError(null);
          mapRef.current?.flyTo(
            [pos.coords.latitude, pos.coords.longitude],
            16,
            { duration: 1.5 },
          );
        },
        (err) => {
          const msg =
            err.code === err.PERMISSION_DENIED
              ? "Permiso denegado"
              : err.code === err.POSITION_UNAVAILABLE
                ? "Ubicación no disponible"
                : "Error al obtener ubicación";
          setGeoError(msg);
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    }
    onToggle();
  }, [tracking, onToggle, mapRef]);

  return (
    <div className="absolute bottom-4 right-4 z-1000 flex flex-col items-end gap-2">
      {geoError && (
        <div className="bg-[#5c1a1a] border border-[#7d2424] text-white text-xs px-3 py-1.5 shadow-xl whitespace-nowrap">
          {geoError}
        </div>
      )}
      <button
        onClick={handleClick}
        data-active={tracking ? "true" : "false"}
        className="flex items-center justify-center border shadow-xl cursor-pointer"
        style={{
          width: 40,
          height: 40,
          background: tracking ? "#38bdf8" : "#0f172a",
          color: tracking ? "#0f172a" : "#f1f5f9",
          borderColor: tracking ? "#38bdf8" : "#475569",
        }}
        title={tracking ? "Dejar de mostrar ubicación" : "Mostrar mi ubicación"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>
  );
}

function PositionCircle({
  position,
}: {
  position: { lat: number; lng: number } | null;
}) {
  if (!position) return null;
  return (
    <Circle
      center={[position.lat, position.lng]}
      radius={30}
      pathOptions={{
        color: "#38bdf8",
        fillColor: "#38bdf8",
        fillOpacity: 0.25,
        weight: 2,
      }}
    />
  );
}

export function AdminMapView({ mipymes }: { mipymes: MipymeWithProducts[] }) {
  const [modal, setModal] = useState<{ lat: number; lng: number } | null>(null);
  const [tracking, setTracking] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [showMarkers, setShowMarkers] = useState(true);
  const watchIdRef = useRef<number | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setModal({ lat, lng });
  }, []);

  const handleLocateToggle = useCallback(() => {
    if (tracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setPosition(null);
      setTracking(false);
    } else {
      if (!navigator.geolocation) return;
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
      );
      watchIdRef.current = id;
      setTracking(true);
    }
  }, [tracking]);

  return (
    <>
      <div className="relative w-full h-full">
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
          {showMarkers &&
            mipymes.map((m) => <Marker key={m.id} position={[m.lat, m.lng]} />)}
          <PositionCircle position={position} />
          <MapHandle mapRef={mapRef} />
        </LeafletMap>

        {/* Toggle markers button */}
        <button
          onClick={() => setShowMarkers(!showMarkers)}
          className="absolute top-3 left-3 z-1000 flex items-center gap-1.5 text-xs px-2.5 py-1.5 border cursor-pointer shadow-xl transition-colors"
          style={{
            background: showMarkers ? "#1e293b" : "#5c1a1a",
            color: showMarkers ? "#f1f5f9" : "#f1f5f9",
            borderColor: showMarkers ? "#475569" : "#7d2424",
          }}
          title={showMarkers ? "Ocultar marcadores" : "Mostrar marcadores"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {showMarkers ? "Ocultar" : "Mostrar"}
        </button>

        <LocateButton
          tracking={tracking}
          onToggle={handleLocateToggle}
          mapRef={mapRef}
        />
      </div>
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
