import { useState, useCallback } from 'react';

export type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  [k: string]: any;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const create = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
    setToasts((t) => [...t, { id, ...toast }]);
    return id;
  }, []);

  const dismiss = useCallback((id?: string) => {
    if (!id) return setToasts([]);
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return { toasts, create, dismiss } as const;
}

export default useToast;
