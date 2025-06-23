'use client';

import React, { createContext, useContext } from 'react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';
import { ToastType } from '@/components/Toast';

interface ToastContextType {
  success: (title: string, message?: string, duration?: number) => string;
  error: (title: string, message?: string, duration?: number) => string;
  warning: (title: string, message?: string, duration?: number) => string;
  info: (title: string, message?: string, duration?: number) => string;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, success, error, warning, info, clearAll, removeToast } = useToast();

  return (
    <ToastContext.Provider value={{ success, error, warning, info, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
