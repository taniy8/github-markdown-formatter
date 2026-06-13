import { useState, useEffect } from "react";

export function useLocalDraft(key: string, defaultValue: string = "") {
  const [value, setValue] = useState(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setValue(saved);
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(key, value);
  }, [key, value, hydrated]);

  return [value, setValue] as const;
}
