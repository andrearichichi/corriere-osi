"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/** Stato persistito in localStorage, robusto a storage assente o bloccato. */
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const initialRef = useRef(initial);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* storage non disponibile: si usa lo stato in memoria */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignora */
    }
  }, [key, value, hydrated]);

  const reset = useCallback(() => setValue(initialRef.current), []);
  return [value, setValue, reset, hydrated] as const;
}
