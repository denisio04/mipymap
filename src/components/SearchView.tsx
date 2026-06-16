'use client';

import { useState, useEffect, startTransition } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { searchProducts } from '@/app/actions/search';
import { MipymeResultCard } from './MipymeResultCard';
import { DEBOUNCE_MS, CIENFUEGOS_CENTER } from '@/lib/constants';
import type { SearchResult } from '@/types';

export type SortFilter = 'cheapest' | 'proximity' | 'transfer';

function groupByMipyme(results: SearchResult[]) {
  const map = new Map<
    string,
    {
      mipymeName: string;
      mipymeImage: string | null;
      acceptsTransfer: boolean;
      mipymeLat: number;
      mipymeLng: number;
      products: { productId: string; productName: string; price: number }[];
    }
  >();

  for (const r of results) {
    let group = map.get(r.mipymeId);
    if (!group) {
      group = {
        mipymeName: r.mipymeName,
        mipymeImage: r.mipymeImage,
        acceptsTransfer: r.acceptsTransfer,
        mipymeLat: r.mipymeLat,
        mipymeLng: r.mipymeLng,
        products: [],
      };
      map.set(r.mipymeId, group);
    }
    group.products.push({
      productId: r.productId,
      productName: r.productName,
      price: r.price,
    });
  }

  return Array.from(map.entries()).map(([mipymeId, group]) => ({
    mipymeId,
    ...group,
  }));
}

function applyFilters(
  groups: ReturnType<typeof groupByMipyme>,
  activeFilters: SortFilter[],
  userLat?: number,
  userLng?: number,
) {
  let filtered = [...groups];

  // filter
  if (activeFilters.includes('transfer')) {
    filtered = filtered.filter((g) => g.acceptsTransfer);
  }

  if (filtered.length === 0) return filtered;

  // sort by cheapest and/or proximity
  const hasCheapest = activeFilters.includes('cheapest');
  const hasProximity = activeFilters.includes('proximity');

  if (hasCheapest || hasProximity) {
    const lat = userLat ?? CIENFUEGOS_CENTER.lat;
    const lng = userLng ?? CIENFUEGOS_CENTER.lng;

    filtered.sort((a, b) => {
      const priceA = Math.min(...a.products.map((p) => p.price));
      const priceB = Math.min(...b.products.map((p) => p.price));
      const distA = Math.hypot(a.mipymeLat - lat, a.mipymeLng - lng);
      const distB = Math.hypot(b.mipymeLat - lat, b.mipymeLng - lng);

      if (hasProximity && hasCheapest) {
        // proximity first, cheapest as tiebreaker
        return distA - distB || priceA - priceB;
      }
      if (hasProximity) return distA - distB;
      if (hasCheapest) return priceA - priceB;
      return 0;
    });
  }

  return filtered;
}

export function SearchView({ activeFilters }: { activeFilters?: SortFilter[] }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, DEBOUNCE_MS);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLat, setUserLat] = useState<number | undefined>();
  const [userLng, setUserLng] = useState<number | undefined>();
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    startTransition(() => { setLocating(true); });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 },
    );
  }, []);

  useEffect(() => {
    if (debouncedQuery.length < 1) return;

    let active = true;
    startTransition(() => { setLoading(true); });
    searchProducts(debouncedQuery).then((data) => {
      if (active) {
        startTransition(() => {
          setResults(data);
          setLoading(false);
        });
      }
    });
    return () => { active = false; };
  }, [debouncedQuery]);

  const groups = groupByMipyme(results);
  const filteredGroups = activeFilters
    ? applyFilters(groups, activeFilters, userLat, userLng)
    : groups;

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-border-light bg-background text-foreground focus:outline-none focus:border-accent"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8 text-muted">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Buscando...</span>
        </div>
      )}

      {locating && activeFilters?.includes('proximity') && (
        <div className="flex items-center justify-center py-4 text-muted">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span className="text-xs">Obteniendo ubicación...</span>
        </div>
      )}

      {!loading && debouncedQuery.length > 0 && filteredGroups.length === 0 && (
        <div className="flex flex-col items-center py-12 text-muted">
          <Search className="w-10 h-10 mb-3" />
          <p className="text-sm">No se encontraron productos</p>
        </div>
      )}

      {!loading && filteredGroups.length > 0 && (
        <div className="space-y-4 pb-4">
          {filteredGroups.map((group) => (
            <MipymeResultCard
              key={group.mipymeId}
              mipymeId={group.mipymeId}
              mipymeName={group.mipymeName}
              mipymeImage={group.mipymeImage}
              acceptsTransfer={group.acceptsTransfer}
              mipymeLat={group.mipymeLat}
              mipymeLng={group.mipymeLng}
              products={group.products}
            />
          ))}
        </div>
      )}
    </div>
  );
}
