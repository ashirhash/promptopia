import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

export const useDebounce = <T>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useTimeAgo = (createdAt: string) => {
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
};
