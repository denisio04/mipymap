"use client";

import { useState, useRef } from "react";
import { X, Upload, Camera, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { createMipyme } from "@/app/actions/admin";
import { fixImageOrientation } from "@/lib/imageUtils";

export function CreateMipymeModal({
  lat,
  lng,
  onCloseAction,
}: {
  lat: number;
  lng: number;
  onCloseAction: () => void;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptsTransfer, setAcceptsTransfer] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [phone, setPhone] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      delivery,
      phone: delivery ? (phone || null) : null,
      openingTime: openingTime || null,
      closingTime: closingTime || null,
      image: imageUrl,
      province: "Cienfuegos",
      municipality: "Cienfuegos",
      lat,
      lng,
    });

    if (result.success) {
      router.refresh();
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
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {preview && (
              <div className="w-full h-48 mt-1 mb-2 border border-border-light overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex-1 border border-border-light bg-background px-3 py-4 flex flex-col items-center gap-1.5 cursor-pointer hover:border-accent transition-colors"
              >
                <Upload className="w-5 h-5 text-muted" />
                <span className="text-xs text-muted">Galería</span>
              </button>
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="flex-1 border border-border-light bg-background px-3 py-4 flex flex-col items-center gap-1.5 cursor-pointer hover:border-accent transition-colors"
              >
                <Camera className="w-5 h-5 text-muted" />
                <span className="text-xs text-muted">Cámara</span>
              </button>
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
          <div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={delivery}
                onChange={(e) => {
                  setDelivery(e.target.checked);
                  if (!e.target.checked) setPhone("");
                }}
                className="accent-accent"
              />
              Hace domicilios
            </label>
          </div>
          {delivery && (
            <div>
              <label className="text-xs text-muted-foreground">
                Teléfono / Contacto
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+53 5XXX XXXX"
                className="w-full mt-1 px-3 py-2 text-sm border border-border-light bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          )}
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
