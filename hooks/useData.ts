"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { isEqual } from "lodash";

export default function useData<Args extends unknown[], Data>({
  func,
  args,
  onSuccess,
  onError,
}: {
  func: (...args: Args) => Promise<Data>;
  args: Args;
  onSuccess?: (data: NonNullable<Awaited<Data>>) => void;
  onError?: (error: unknown) => void;
}): {
  data: Data | undefined;
  loading: boolean;
  refresh: () => void;
  error: unknown;
} {
  const [refresh, setRefresh] = useState(0),
    [data, setData] = useState<Data>(),
    [loading, setIsPending] = useState(false),
    [error, setError] = useState<unknown>(),
    prevArgsRef = useRef<Args>(undefined),
    memoizedFunc = useCallback(() => {
      if (!isEqual(prevArgsRef.current, args)) {
        prevArgsRef.current = args;
      } else {
      }
      return func(...args);
    }, [func, ...args]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsPending(true);
      setError(null);
      try {
        const result = await memoizedFunc();
        if (isMounted) {
          setData(result);
          if (onSuccess && result) onSuccess(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          if (onError) onError(err);
        }
      } finally {
        if (isMounted) {
          setIsPending(false);
        }
      }
    };

    const debounceFetchData = setTimeout(fetchData, 300);

    return () => {
      isMounted = false;
      clearTimeout(debounceFetchData);
    };
  }, [memoizedFunc, refresh]);

  return {
    data,
    loading,
    error,
    refresh: () => setRefresh(Date.now()),
  };
}
