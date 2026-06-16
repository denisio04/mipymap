'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, ShieldPlus } from 'lucide-react';
import { CreateAdminModal } from './CreateAdminModal';

export function AdminHeader() {
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);

  return (
    <>
      <header className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="font-semibold text-sm">Panel ADMIN</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateAdmin(true)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent cursor-pointer transition-colors"
          >
            <ShieldPlus className="w-4 h-4" />
            Crear Admin
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </header>
      {showCreateAdmin && (
        <CreateAdminModal onCloseAction={() => setShowCreateAdmin(false)} />
      )}
    </>
  );
}
