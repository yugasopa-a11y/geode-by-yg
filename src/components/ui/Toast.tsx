import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={cn(
              "glass-panel px-4 py-3 rounded-xl flex items-center gap-3 min-w-[280px] pointer-events-auto",
              toast.type === 'success' && "border-green-500/30",
              toast.type === 'error' && "border-red-500/30",
              toast.type === 'info' && "border-[#c9a96e]/30"
            )}
          >
            <div className={cn(
              "flex-shrink-0",
              toast.type === 'success' && "text-green-400",
              toast.type === 'error' && "text-red-400",
              toast.type === 'info' && "text-[#c9a96e]"
            )}>
              {toast.type === 'success' && <CheckCircle size={18} />}
              {toast.type === 'error' && <AlertCircle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
            </div>

            <p className="text-sm text-text-primary flex-1">{toast.message}</p>

            <button
              onClick={() => onRemove(toast.id)}
              className="text-text-secondary hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
