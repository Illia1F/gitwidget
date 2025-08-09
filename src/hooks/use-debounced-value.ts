import { useEffect, useState } from 'react';

/**
 * Return a debounced version of a value that only updates after the given delay.
 */
export const useDebouncedValue = <T>(value: T, delayMs = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
};
