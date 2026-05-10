"use client";

import { useEffect, useState } from "react";
import { getStockfish } from "./StockfishEngine";

export function useStockfish(autoInit = true) {
  const engine = getStockfish();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!autoInit) return;
    let alive = true;
    engine
      .init()
      .then(() => {
        if (alive) setReady(true);
      })
      .catch((err: Error) => {
        if (alive) setError(err);
      });
    return () => {
      alive = false;
    };
  }, [autoInit, engine]);

  return { engine, ready, error };
}
