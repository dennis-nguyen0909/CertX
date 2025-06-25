import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * useUrlSyncState - Syncs a state value with a URL query param (with debounce and initialization from URL)
 * @param paramKey The query param key to sync
 * @param debounceMs Debounce delay in ms (default: 500)
 * @returns [value, setValue]
 */
export function useUrlSyncState(
  paramKey: string,
  debounceMs = 500
): [string, (v: string) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Initialize from URL param
  const initial = searchParams.get(paramKey) || "";
  const [value, setValue] = useState<string>(initial);
  const [debouncedValue, setDebouncedValue] = useState<string>(initial);

  // Update debounced value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [value, debounceMs]);

  // Update URL when debounced value changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedValue) {
      params.set(paramKey, debouncedValue);
    } else {
      params.delete(paramKey);
    }
    const newUrl = `?${params.toString()}`;
    if (window.location.search !== newUrl) {
      router.replace(newUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  // If URL param changes (e.g. via browser nav), update state
  useEffect(() => {
    const urlValue = searchParams.get(paramKey) || "";
    setValue(urlValue);
    setDebouncedValue(urlValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get(paramKey)]);

  return [value, setValue];
}
