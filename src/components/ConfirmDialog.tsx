import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Confirmation dialog for destructive actions
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const variantStyles = {
    danger: {
      iconBg: 'bg-tomato/10',
      iconColor: 'text-tomato',
      buttonBg: 'bg-tomato hover:bg-red-600',
    },
    warning: {
      iconBg: 'bg-butter/30',
      iconColor: 'text-yellow-700',
      buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      iconBg: 'bg-sage/20',
      iconColor: 'text-sage-dark',
      buttonBg: 'bg-sage hover:bg-sage-dark',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="space-y-4">
      {/* Icon and message */}
      <div className="flex gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center`}>
          <AlertTriangle size={20} className={styles.iconColor} />
        </div>
        <div>
          <h3 className="font-medium text-charcoal">{title}</h3>
          <p className="mt-1 text-sm text-warm-gray">{message}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="
            flex-1 px-4 py-2.5 rounded-lg
            border border-light-gray/50
            text-warm-gray font-medium
            hover:bg-light-gray/20 hover:text-charcoal
            transition-colors
          "
          disabled={isLoading}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`
            flex-1 px-4 py-2.5 rounded-lg
            ${styles.buttonBg} text-white font-medium
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          `}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : confirmLabel}
        </button>
      </div>
    </div>
  );
};

export default ConfirmDialog;
