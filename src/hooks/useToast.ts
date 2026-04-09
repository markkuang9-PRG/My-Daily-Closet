import { useCallback, useMemo, useRef, useState } from 'react';
import type { ToastInput, ToastItem } from '../types';

const TOAST_TIMEOUT_MS = 3200;

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef<Record<string, number>>({});

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));

    const timeoutId = timeoutsRef.current[id];
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      delete timeoutsRef.current[id];
    }
  }, []);

  const showToast = useCallback(
    ({ message, tone = 'info' }: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((current) => [...current, { id, message, tone }]);

      timeoutsRef.current[id] = window.setTimeout(() => {
        dismissToast(id);
      }, TOAST_TIMEOUT_MS);
    },
    [dismissToast],
  );

  return useMemo(
    () => ({
      dismissToast,
      showToast,
      toasts,
    }),
    [dismissToast, showToast, toasts],
  );
};
