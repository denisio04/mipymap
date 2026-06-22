"use client";

import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { CIENFUEGOS_CENTER, DEFAULT_ZOOM } from "@/lib/constants";
import type { MipymeWithProducts } from "@/types";
import { useState, useCallback, useRef, useEffect } from "react";
import type { MutableRefObject } from "react";
import { createPortal } from "react-dom";
import { ProductModal } from "./ProductModal";
import { FaqModal } from "./FaqModal";
import { isOpenNow } from "@/lib/utils";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FlyTo({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.flyTo([lat, lng], 16, { duration: 1.5 });
    }
  }, [lat, lng, map]);
  return null;
}

function MapHandle({ mapRef }: { mapRef: MutableRefObject<L.Map | null> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

function LocateCircle({
  position,
}: {
  position: { lat: number; lng: number } | null;
}) {
  if (!position) return null;
  return (
    <Circle
      key={`${position.lat}-${position.lng}`}
      center={[position.lat, position.lng]}
      radius={50}
      pathOptions={{
        color: "#ef4444",
        fillColor: "#ef4444",
        fillOpacity: 0.3,
        weight: 2,
      }}
    />
  );
}

function MarkerPopup({
  mipyme,
  onSelect,
}: {
  mipyme: MipymeWithProducts;
  onSelect: (m: MipymeWithProducts) => void;
}) {
  const map = useMap();
  const open = isOpenNow(mipyme.openingTime, mipyme.closingTime);

  return (
    <Marker position={[mipyme.lat, mipyme.lng]}>
      <Popup>
        <div className="flex flex-col min-w-160px">
          {mipyme.image && (
            <div className="relative w-full aspect-square border-b border-[#334155]">
              <Image
                src={mipyme.image}
                alt={mipyme.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="flex flex-col gap-2 px-3 py-2.5">
            <div className=" text-center">
              <p className="text-lg font-medium">{mipyme.name}</p>
              <p
                className="text-xs mt-2"
                style={{ color: open ? "#22c55e" : "#ef4444" }}
              >
                {mipyme.openingTime && mipyme.closingTime
                  ? open
                    ? "Abierto ahora"
                    : "Cerrado"
                  : "Horario no definido"}
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {mipyme.acceptsTransfer
                  ? "Acepta transferencia"
                  : "No acepta transferencia"}
              </p>
            </div>
            <button
              onClick={() => onSelect(mipyme)}
              className="w-full text-xs font-medium text-white bg-#0f172a border border-[#334155] px-3 py-1.5 cursor-pointer hover:bg-#1e293b transition-colors"
            >
              Ver Productos
            </button>
            {mipyme.delivery && mipyme.phone && (
              <a
                href={`https://wa.me/${mipyme.phone?.replace(/[^0-9]/g, '')}`}
                className="block w-full text-xs font-bold text-center text-[#0a0a0a] bg-accent border border-accent px-3 py-1.5 cursor-pointer hover:opacity-90 transition-opacity no-underline"
              >
                Hacer Pedido
              </a>
            )}
            <button
              onClick={() => map.closePopup()}
              className="w-full text-xs font-medium text-white bg-[#5c1a1a] border border-[#7d2424] px-3 py-1.5 cursor-pointer hover:bg-[#7d2424] transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export function MapView({
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
  const [selected, setSelected] = useState<MipymeWithProducts | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [tracking, setTracking] = useState(false);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const hasFlownRef = useRef(false);
  const focusId = selectedMipymeId ?? null;

  let visible = tracking
    ? focusId
      ? mipymes.filter((m) => m.id === focusId)
      : []
    : focusId
      ? mipymes.filter((m) => m.id === focusId)
      : mipymes;

  if (showOpenOnly) {
    visible = visible.filter((m) => isOpenNow(m.openingTime, m.closingTime));
  }

  const flyLat = focusId && flyToLat !== undefined ? flyToLat : null;
  const flyLng = focusId && flyToLng !== undefined ? flyToLng : null;

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleLocateOff = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    hasFlownRef.current = false;
    setPosition(null);
    setTracking(false);
    setGeoError(null);
  }, []);

  const handleSelectMipyme = useCallback((m: MipymeWithProducts) => {
    setSelected(m);
    fetch(`/api/mipymes/${m.id}/interact`, { method: "POST" }).catch(() => {});
  }, []);

  const handleLocateOn = useCallback(() => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocalización no disponible");
      return;
    }
    setTracking(true);
    hasFlownRef.current = false;
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setGeoError(null);
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        if (!hasFlownRef.current) {
          hasFlownRef.current = true;
          mapRef.current?.flyTo([latitude, longitude], DEFAULT_ZOOM, {
            duration: 1.5,
          });
        }
      },
      (err) => {
        const msg =
          err.code === err.PERMISSION_DENIED
            ? "Permiso denegado - usa HTTPS o localhost"
            : err.code === err.POSITION_UNAVAILABLE
              ? "Ubicación no disponible"
              : err.code === err.TIMEOUT
                ? "Tiempo de espera agotado"
                : "Error al obtener ubicación";
        setGeoError(msg);
        setTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
    watchIdRef.current = id;
  }, []);

  const locateIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
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
  );

  return (
    <div className="w-full h-full relative" id="map-wrapper">
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
        {visible.map((m) => (
          <MarkerPopup key={m.id} mipyme={m} onSelect={handleSelectMipyme} />
        ))}
        <FlyTo lat={flyLat} lng={flyLng} />
        <MapHandle mapRef={mapRef} />
        <LocateCircle position={position} />
      </LeafletMap>

      {typeof window !== "undefined" &&
        createPortal(
          <>
            {/* Right side: filters + locate */}
            <div className="fixed bottom-6 right-6 z-99999 flex flex-col items-end gap-2">
              {geoError && (
                <div className="bg-[#5c1a1a] border border-[#7d2424] text-white text-xs px-3 py-1.5 shadow-xl whitespace-nowrap">
                  {geoError}
                </div>
              )}
              <button
                onClick={() => setShowOpenOnly(!showOpenOnly)}
                data-active={showOpenOnly ? "true" : "false"}
                className="flex items-center justify-center border shadow-xl cursor-pointer"
                style={{
                  width: 48,
                  height: 48,
                  background: showOpenOnly ? "#4ade80" : "#0f172a",
                  color: showOpenOnly ? "#0f172a" : "#f1f5f9",
                  borderColor: showOpenOnly ? "#4ade80" : "#475569",
                }}
                title={showOpenOnly ? "Mostrar todas" : "Solo abiertas ahora"}
              >
                <Clock className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  tracking ? handleLocateOff() : handleLocateOn();
                }}
                data-active={tracking ? "true" : "false"}
                className="flex items-center justify-center border shadow-xl cursor-pointer"
                style={{
                  width: 48,
                  height: 48,
                  background: tracking ? "#4ade80" : "#0f172a",
                  color: tracking ? "#0f172a" : "#f1f5f9",
                  borderColor: tracking ? "#4ade80" : "#475569",
                }}
              >
                {locateIcon}
              </button>
            </div>

            {/* Left side: FAQ button */}
            <div className="fixed bottom-6 left-6 z-99999 flex flex-col items-start gap-2">
              <button
                onClick={() => setShowFaq(true)}
                className="flex items-center justify-center border shadow-xl cursor-pointer"
                style={{
                  width: 48,
                  height: 48,
                  background: "#0f172a",
                  color: "#f1f5f9",
                  borderColor: "#475569",
                }}
                title="Preguntas frecuentes"
              >
                <span className="text-lg font-bold">?</span>
              </button>
            </div>
          </>,
          document.body,
        )}

      {tracking && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-s1000">
          <button
            onClick={handleLocateOff}
            className="inline-block text-xs font-medium text-white bg-#0f172a border border-[#334155] px-3 py-1.5 hover:bg-#1e293b transition-colors cursor-pointer"
          >
            Ver todas las Mipymes
          </button>
        </div>
      )}

      {focusId && !tracking && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-1000">
          <Link
            href="/"
            className="inline-block text-xs font-medium text-white bg-#0f172a border border-[#334155] px-3 py-1.5 hover:bg-#1e293b transition-colors"
          >
            Ver todas las Mipymes
          </Link>
        </div>
      )}

      {selected && (
        <ProductModal
          mipyme={selected}
          onCloseAction={() => setSelected(null)}
        />
      )}

      {showFaq && <FaqModal onCloseAction={() => setShowFaq(false)} />}
    </div>
  );
}
