"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function TopNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/login")) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-9999 bg-surface/10 backdrop-blur-md border-b border-surface/50">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Link
            href="/login"
            className="font-semibold text-xl tracking-tight text-foreground"
          >
            <span className="text-accent">Mipy</span>Map
          </Link>
          <div className="flex items-center bg-background/50 rounded-none p-0.5">
            <Link
              href="/"
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === "/"
                  ? "bg-accent text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Mapa
            </Link>
            <Link
              href="/lista"
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === "/lista"
                  ? "bg-accent text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Lista
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
