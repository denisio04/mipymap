'use client';

import { useEffect, useState } from 'react';

export function LiveCounter({
  mipymeId,
  initial,
}: {
  mipymeId: string;
  initial: number;
}) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    const url = `/api/mipymes/${mipymeId}/interact/stream`;
    const source = new EventSource(url);

    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (typeof data.interactions === 'number') {
          setCount(data.interactions);
        }
      } catch {
        /* ignore malformed data */
      }
    };

    source.onerror = () => {
      source.close();
    };

    return () => source.close();
  }, [mipymeId]);

  return (
    <span className="text-xs text-muted ml-2">Interacciones: {count}</span>
  );
}
