"use client";

import { useState } from "react";
import type { MipymeWithProducts } from "@/types";
import { AdminMapContainer } from "./AdminMapContainer";

export function ToggleMapSection({
  mipymes,
}: {
  mipymes: MipymeWithProducts[];
}) {
  const [visible, setVisible] = useState(true);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Registrar nueva Mipyme</h2>
        <button
          onClick={() => setVisible(!visible)}
          className="text-xs text-muted-foreground hover:text-foreground border border-border px-2.5 py-1 cursor-pointer transition-colors"
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      {visible && (
        <div className="h-300px border border-border">
          <AdminMapContainer mipymes={mipymes} />
        </div>
      )}
    </section>
  );
}
