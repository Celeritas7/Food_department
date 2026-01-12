import React from 'react';
import { SpoilageStatus } from '@/entities/ingredient';
import { AlertCircle, Clock, CheckCircle, HelpCircle } from 'lucide-react';

interface SpoilageBadgeProps {
  status: SpoilageStatus;
  daysRemaining: number | null;
  showDays?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Visual badge indicating spoilage status
 */
export const SpoilageBadge: React.FC<SpoilageBadgeProps> = ({
  status,
  daysRemaining,
  showDays = true,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'Fresh':
        return {
          bgColor: 'bg-sage/20',
          textColor: 'text-sage-dark',
          borderColor: 'border-sage/30',
          icon: CheckCircle,
          label: 'Fresh',
        };
      case 'NearExpiry':
        return {
          bgColor: 'bg-butter/40',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-400/50',
          icon: Clock,
          label: 'Expires soon',
        };
      case 'Expired':
        return {
          bgColor: 'bg-tomato/20',
          textColor: 'text-tomato',
          borderColor: 'border-tomato/30',
          icon: AlertCircle,
          label: 'Expired',
        };
      case 'Unknown':
      default:
        return {
          bgColor: 'bg-light-gray/30',
          textColor: 'text-warm-gray',
          borderColor: 'border-light-gray/50',
          icon: HelpCircle,
          label: 'No data',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const getDaysText = () => {
    if (!showDays || daysRemaining === null) return null;

    if (daysRemaining < 0) {
      const days = Math.abs(daysRemaining);
      return `${days}d ago`;
    } else if (daysRemaining === 0) {
      return 'Today';
    } else if (daysRemaining === 1) {
      return '1d left';
    } else {
      return `${daysRemaining}d left`;
    }
  };

  const daysText = getDaysText();

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${sizeClasses[size]}
        ${config.bgColor}
        ${config.textColor}
        ${config.borderColor}
      `}
    >
      <Icon size={iconSizes[size]} />
      <span>{config.label}</span>
      {daysText && (
        <span className="opacity-75">· {daysText}</span>
      )}
    </span>
  );
};

export default SpoilageBadge;
