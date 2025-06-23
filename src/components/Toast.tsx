'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastStyles = {
  success: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-900 shadow-green-100',
  error: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-900 shadow-red-100',
  warning: 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 text-yellow-900 shadow-yellow-100',
  info: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-900 shadow-blue-100',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const Icon = toastIcons[type];

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-500 ease-out
        ${isVisible && !isLeaving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
        }
        max-w-md w-full pointer-events-auto
      `}
    >
      <div className={`
        relative rounded-xl border-l-4 p-4 shadow-xl backdrop-blur-sm
        ${toastStyles[type]}
        hover:shadow-2xl transition-all duration-300
      `}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className={`
              p-1 rounded-full bg-white/20 backdrop-blur-sm
            `}>
              <Icon className={`h-5 w-5 ${iconStyles[type]}`} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-5">{title}</p>
            {message && (
              <p className="mt-1 text-sm leading-5 opacity-90">{message}</p>
            )}
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex rounded-md p-1.5 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-200"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4 opacity-70 hover:opacity-100" />
            </button>
          </div>
        </div>

        {/* Progress bar for auto-dismiss */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-xl overflow-hidden">
            <div
              className="h-full bg-white/40 transition-all ease-linear"
              style={{
                animation: `toast-progress ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }: {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-h-screen overflow-hidden">
      <div className="flex flex-col space-y-3">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              zIndex: 1000 - index,
              transform: `translateY(${index * 4}px) scale(${1 - index * 0.02})`,
            }}
          >
            <Toast {...toast} onClose={onClose} />
          </div>
        ))}
      </div>
    </div>
  );
}
