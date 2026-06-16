'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function MipymeHeader({ mipymeName }: { mipymeName: string }) {
  return (
    <header className="border-b border-border px-4 py-3 flex items-center justify-between">
      <div>
        <h1 className="font-semibold text-sm">Panel MIPYME</h1>
        <p className="text-xs text-muted">{mipymeName}</p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </button>
    </header>
  );
}
