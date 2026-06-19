"use client";

import { useState, useRef } from "react";
import { X, Upload, Camera, Eye, EyeOff } from "lucide-react";
import { updateMipyme } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { fixImageOrientation } from "@/lib/imageUtils";

export function EditMipymeModal({
  mipyme,
  onCloseAction,
}: {
  mipyme: { id: string; name: string; acceptsTransfer: boolean; openingTime: string | null; closingTime: string | null; province: string; municipality: string; image: string | null };
  onCloseAction: () => void;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(mipyme.name);
  const [acceptsTransfer, setAcceptsTransfer] = useState(
    mipyme.acceptsTransfer,
  );
  const [openingTime, setOpeningTime] = useState(mipyme.openingTime ?? "");
  const [closingTime, setClosingTime] = useState(mipyme.closingTime ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [province] = useState(mipyme.province);
  const [municipality] = useState(mipyme.municipality);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentImage = mipyme.image;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.files?.[0] || null;
    if (!raw) {
      setFile(null);
      setPreview(null);
      return;
    }
    const fixed = await fixImageOrientation(raw);
    setFile(fixed);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(fixed);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) {
      setError("El nombre es requerido");
      return;
    }

    setLoading(true);
    setError("");

    let imageUrl: string | null = currentImage;

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

    await updateMipyme(mipyme.id, {
      name,
      acceptsTransfer,
      openingTime: openingTime || null,
      closingTime: closingTime || null,
      image: imageUrl,
      province,
      municipality,
      password: password || null,
    });
    router.refresh();
    onCloseAction();
  }

  return (
    <div className="fixed inset-0 z-9999 bg-black/60 flex items-end sm:items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-surface w-full max-w-sm mx-auto p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm">Editar Mipyme</h2>
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
            <label className="text-xs text-muted-foreground">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm border border-border-light bg-background text-foreground focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Contraseña</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Dejar en blanco para mantener"
                className="w-full px-3 py-2 text-sm border border-border-light bg-background text-foreground focus:outline-none focus:border-accent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">
              Foto de la fachada
            </label>
            <div className="mt-1 border border-border-light bg-background px-3 py-4 flex flex-col items-center gap-1.5 cursor-pointer hover:border-accent transition-colors relative">
              <div
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-1.5 w-full"
              >
                {preview ? (
                  <div className="w-full h-48 overflow-hidden border border-border-light">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : currentImage ? (
                  <div className="w-full h-48 overflow-hidden border border-border-light">
                    <img
                      src={currentImage}
                      alt={name}
                      className="w-full h-full object-cover"
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
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 py-1.5 text-xs border border-border-light text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Galería
                </button>
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="flex-1 py-1.5 text-xs border border-border-light text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Cámara
                </button>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Hora apertura</label>
              <input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-border-light bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Hora cierre</label>
              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-border-light bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>
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

        {error && <p className="text-xs text-danger mt-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-2.5 text-sm font-medium text-background bg-accent cursor-pointer disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
