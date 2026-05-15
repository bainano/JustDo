import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastOptions {
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

const defaultOptions: ToastOptions = {
  type: 'info',
  duration: 3000,
};

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: AlertCircle,
};

const colorMap = {
  success: { text: '#4ade80', border: 'rgba(74, 222, 128, 0.3)' },
  error: { text: '#f87171', border: 'rgba(248, 113, 113, 0.3)' },
  warning: { text: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' },
  info: { text: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)' },
};

function Toast({ message, options, onClose }: {
  message: string;
  options: ToastOptions;
  onClose: () => void;
}) {
  const { type = 'info', duration = 3000 } = options;
  const Icon = iconMap[type];
  const colors = colorMap[type];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        'fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 border transform transition-all duration-200 ease-out rounded-lg'
      )}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: colors.border,
        color: colors.text,
        transform: visible ? 'translate(-50%, 0)' : 'translate(-50%, 100%)',
        opacity: visible ? 1 : 0
      }}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 200);
        }}
        className="p-0.5 transition-colors"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

let toastRoot: ReturnType<typeof createRoot> | null = null;
let toastContainer: HTMLDivElement | null = null;
let toastId = 0;

export function showToast(message: string, options?: ToastOptions) {
  const opts = { ...defaultOptions, ...options };

  if (!toastContainer) {
    toastContainer = document.createElement('div');
    document.body.appendChild(toastContainer);
    toastRoot = createRoot(toastContainer);
  }

  const id = ++toastId;
  const container = document.createElement('div');
  toastContainer.appendChild(container);

  const root = createRoot(container);
  root.render(
    <Toast
      message={message}
      options={opts}
      onClose={() => {
        root.unmount();
        container.remove();
        if (toastContainer?.childElementCount === 0 && toastRoot) {
          toastContainer.remove();
          toastContainer = null;
          toastRoot = null;
        }
      }}
    />
  );

  return id;
}
