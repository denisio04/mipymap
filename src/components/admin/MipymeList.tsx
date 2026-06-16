"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EditMipymeModal } from "./EditMipymeModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { resetMipymeCountdown } from "@/app/actions/admin";

interface MipymeItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  acceptsTransfer: boolean;
  province: string;
  municipality: string;
  image: string | null;
  products: { id: string }[];
  user: { username: string };
  createdAt: string;
}

const MEMBERSHIP_DAYS = 30;

function daysRemaining(createdAt: string): number {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const elapsed = now - created;
  const remaining =
    MEMBERSHIP_DAYS - Math.floor(elapsed / (1000 * 60 * 60 * 24));
  return remaining;
}

export function MipymeList({ mipymes }: { mipymes: MipymeItem[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<MipymeItem | null>(null);
  const [deleting, setDeleting] = useState<MipymeItem | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);

  async function handleReset(id: string) {
    setResettingId(id);
    await resetMipymeCountdown(id);
    router.refresh();
  }

  const [sortByExpiry, setSortByExpiry] = useState(false);

  const sorted = sortByExpiry
    ? [...mipymes].sort(
        (a, b) => daysRemaining(a.createdAt) - daysRemaining(b.createdAt),
      )
    : mipymes;

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-muted py-8 text-center">
        No hay mipymes registradas
      </p>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Mipymes registradas</h2>
        <button
          onClick={() => setSortByExpiry(!sortByExpiry)}
          className={`text-xs border px-2.5 py-1 cursor-pointer transition-colors ${
            sortByExpiry
              ? "bg-accent text-background border-accent"
              : "text-muted-foreground border-border hover:text-foreground"
          }`}
        >
          {sortByExpiry ? "▼" : "Ordenar"}
        </button>
      </div>
      <div className="space-y-3">
        {sorted.map((m) => (
          <div key={m.id} className="border border-border p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm">{m.name}</p>
                {m.image && (
                  <div className="relative mt-2 w-16 h-16 border border-border">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {m.products.length} producto
                  {m.products.length !== 1 ? "s" : ""}
                </p>
                {(() => {
                  const remaining = daysRemaining(m.createdAt);
                  if (remaining > 0) {
                    return (
                      <p
                        className="text-2xl mt-6 whitespace-nowrap"
                        style={{
                          color: remaining <= 5 ? "#ef4444" : "#38bdf8",
                        }}
                      >
                        {remaining} día{remaining !== 1 ? "s" : ""}
                      </p>
                    );
                  }
                  return (
                    <button
                      onClick={() => handleReset(m.id)}
                      disabled={resettingId === m.id}
                      className="text-xs mt-1 text-accent underline cursor-pointer disabled:opacity-50 whitespace-nowrap"
                    >
                      {resettingId === m.id ? "Reiniciando..." : "Reiniciar"}
                    </button>
                  );
                })()}
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span
                className={m.acceptsTransfer ? "text-foreground" : "text-muted"}
              >
                {m.acceptsTransfer
                  ? "Acepta transferencia"
                  : "No acepta transferencia"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(m)}
                  className="text-muted-foreground underline cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => setDeleting(m)}
                  className="text-danger underline cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <EditMipymeModal mipyme={editing} onCloseAction={() => setEditing(null)} />
      )}

      {deleting && (
        <DeleteConfirmModal
          name={deleting.name}
          id={deleting.id}
          onCloseAction={() => setDeleting(null)}
        />
      )}
    </>
  );
}
