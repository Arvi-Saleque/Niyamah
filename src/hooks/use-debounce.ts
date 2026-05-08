"use client";

import { useEffect, useState } from "react";

/**
 * Returns `value` after `delay` ms of inactivity.
 * Each new `value` resets the timer; a fast typist gets only one final update.
 */
export function useDebounce<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
