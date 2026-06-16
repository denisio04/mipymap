"use client";

import { useState } from "react";
import { X, Shield } from "lucide-react";
import { createAdmin } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export function CreateAdminModal({
  onCloseAction,
}: {
  onCloseAction: () => void;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setError("Todos los campos son requeridos");
      return;
    }
    setLoading(true);
    setError("");

    const result = await createAdmin({ username, password });

    if (result.success) {
      router.refresh();
      onCloseAction();
    } else {
      setError(result.error || "Error al crear el admin");
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
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            <h2 className="font-semibold text-sm">Crear Admin</h2>
          </div>
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
              Nombre de usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
        </div>

        {error && <p className="text-xs text-danger mt-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-2.5 text-sm font-medium text-background bg-accent cursor-pointer disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear Admin"}
        </button>
      </form>
    </div>
  );
}
