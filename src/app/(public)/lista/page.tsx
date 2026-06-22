"use client";

import { useState } from "react";
import { SearchView } from "@/components/SearchView";
import type { SortFilter } from "@/components/SearchView";
import { ListFilter, TrendingDown, MapPin, ArrowLeftRight, Clock, Truck } from "lucide-react";

const FILTERS: {
  key: SortFilter;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "cheapest", label: "Más barato", icon: <TrendingDown className="w-3.5 h-3.5" /> },
  { key: "proximity", label: "Cercanía", icon: <MapPin className="w-3.5 h-3.5" /> },
  { key: "transfer", label: "Transferencia", icon: <ArrowLeftRight className="w-3.5 h-3.5" /> },
  { key: "opennow", label: "Abierto", icon: <Clock className="w-3.5 h-3.5" /> },
  { key: "delivery", label: "Domicilio", icon: <Truck className="w-3.5 h-3.5" /> },
];

export default function ListaPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SortFilter[]>([]);

  function handleToggle(value: SortFilter) {
    setActiveFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value],
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Lista de Productos</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 text-sm transition-colors cursor-pointer ${
            showFilters || activeFilters.length > 0
              ? "text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListFilter className="w-4 h-4" />
          Filtros
          {activeFilters.length > 0 && (
            <span className="text-[10px] bg-accent text-background font-medium px-1.5 py-0.5 leading-none">
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {FILTERS.map(({ key, label, icon }) => {
            const active = activeFilters.includes(key);
            const isOpenNow = key === "opennow";
            return (
              <button
                key={key}
                onClick={() => handleToggle(key)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border transition-colors cursor-pointer ${
                  active
                    ? isOpenNow
                      ? "bg-[#22c55e] text-background border-[#22c55e]"
                      : "bg-accent text-background border-accent"
                    : "bg-surface text-muted-foreground border-border hover:border-accent hover:text-foreground"
                }`}
              >
                {icon}
                {label}
              </button>
            );
          })}
        </div>
      )}

      <SearchView activeFilters={activeFilters} />
    </div>
  );
}
