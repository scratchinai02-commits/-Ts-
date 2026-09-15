import React from 'react';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  icon?: string;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, icon, visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-2.5 font-bold text-sm border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
      <span className="text-lg">{icon || '🪄'}</span>
      <span>{message}</span>
    </div>
  );
};
