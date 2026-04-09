import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { ToastItem } from '../types';

type ToastStackProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

const toneStyles = {
  error: {
    icon: AlertCircle,
    iconClassName: 'text-red-500',
    ringClassName: 'ring-red-100',
  },
  info: {
    icon: Info,
    iconClassName: 'text-blue-500',
    ringClassName: 'ring-blue-100',
  },
  success: {
    icon: CheckCircle2,
    iconClassName: 'text-green-500',
    ringClassName: 'ring-green-100',
  },
} as const;

export const ToastStack = ({ toasts, onDismiss }: ToastStackProps) => {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 z-40 flex flex-col items-center gap-2 px-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = toneStyles[toast.tone];
          const Icon = style.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ${style.ringClassName}`}
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.iconClassName}`} />
              <p className="flex-1 text-sm leading-5 text-gray-700">{toast.message}</p>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
