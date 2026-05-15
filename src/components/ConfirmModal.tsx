import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, onConfirm]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onCancel}>
      <div
        className="w-full max-w-sm mx-4"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          <button
            onClick={onCancel}
            className="p-1 transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 py-4">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{message}</p>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-3" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-3 py-1.5 text-xs transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {cancelText}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className="px-3 py-1.5 text-xs transition-colors"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
