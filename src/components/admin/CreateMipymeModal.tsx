"use client";

import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import { createMipyme } from "@/app/actions/admin";

export function CreateMipymeModal({
  lat,
  lng,
  onCloseAction,
}: {
  lat: number;
  lng: number;
  onCloseAction: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [acceptsTransfer, setAcceptsTransfer] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !password) {
      setError("Todos los campos son requeridos");
      return;
    }
    setLoading(true);
    setError("");

    let imageUrl: string | null = null;

    if (file) {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        setError("Error al subir la imagen");
        setLoading(false);
        return;
      }
      const data = await res.json();
      imageUrl = data.url;
    }

    const result = await createMipyme({
      name,
      password,
      acceptsTransfer,
      image: imageUrl,
      province: "Cienfuegos",
      municipality: "Cienfuegos",
      lat,
      lng,
    });

    if (result.success) {
      onCloseAction();
    } else {
      setError(result.error || "Error al crear la mipyme");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-9999 bg-black/60 flex items-end sm:items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-surface w-full max-w-sm mx-auto p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm">Registrar Mipyme</h2>
          <button
            type="button"
            onClick={onCloseAction}
            className="text-muted-foreground cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">
              Nombre de la Mipyme
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm border border-border-light bg-background text-foreground focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm border border-border-light bg-background text-foreground focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">
              Foto de la fachada
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="mt-1 border border-border-light bg-background px-3 py-4 flex flex-col items-center gap-1.5 cursor-pointer hover:border-accent transition-colors"
            >
              {preview ? (
                <div className="relative w-full aspect-square">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-muted" />
                  <span className="text-xs text-muted">
                    Haz clic para seleccionar una imagen
                  </span>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={acceptsTransfer}
                onChange={(e) => setAcceptsTransfer(e.target.checked)}
                className="accent-accent"
              />
              Acepta Transferencia
            </label>
          </div>
        </div>

        {error && <p className="text-xs text-danger mt-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-2.5 text-sm font-medium text-background bg-accent cursor-pointer disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear Mipyme"}
        </button>
      </form>
    </div>
  );
}
