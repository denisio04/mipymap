"use client";

import { useState } from "react";
import { deleteMipyme } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export function DeleteConfirmModal({
  id,
  name,
  onCloseAction,
}: {
  id: string;
  name: string;
  onCloseAction: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteMipyme(id);
    router.refresh();
    onCloseAction();
  }

  return (
    <div className="fixed inset-0 z-9999 bg-black/60 flex items-center justify-center">
      <div className="bg-surface w-full max-w-sm mx-auto p-5">
        <p className="text-sm mb-4">
          ¿Estás seguro de eliminar <strong>{name}</strong>? Esta acción no se
          puede deshacer.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCloseAction}
            className="flex-1 py-2.5 text-sm border border-border-light text-foreground cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-medium text-foreground bg-danger cursor-pointer disabled:opacity-50"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
