import React from 'react';
import { IngredientWithSpoilage, SpoilageStatus } from '@/entities/ingredient';
import { getSpoilageSummary } from '@/engines/spoilage';
import { CheckCircle, Clock, AlertCircle, HelpCircle } from 'lucide-react';

interface SpoilageSummaryProps {
  ingredients: IngredientWithSpoilage[];
}

/**
 * Summary bar showing counts of ingredients by spoilage status
 */
export const SpoilageSummary: React.FC<SpoilageSummaryProps> = ({
  ingredients,
}) => {
  const summary = getSpoilageSummary(ingredients);
  const total = ingredients.length;

  if (total === 0) return null;

  const items: {
    status: SpoilageStatus;
    count: number;
    icon: typeof CheckCircle;
    label: string;
    colorClass: string;
  }[] = [
    {
      status: 'Fresh',
      count: summary.Fresh,
      icon: CheckCircle,
      label: 'Fresh',
      colorClass: 'text-sage-dark bg-sage/20',
    },
    {
      status: 'NearExpiry',
      count: summary.NearExpiry,
      icon: Clock,
      label: 'Expiring',
      colorClass: 'text-yellow-700 bg-butter/40',
    },
    {
      status: 'Expired',
      count: summary.Expired,
      icon: AlertCircle,
      label: 'Expired',
      colorClass: 'text-tomato bg-tomato/20',
    },
    {
      status: 'Unknown',
      count: summary.Unknown,
      icon: HelpCircle,
      label: 'Unknown',
      colorClass: 'text-warm-gray bg-light-gray/30',
    },
  ];

  // Only show items with count > 0
  const visibleItems = items.filter(item => item.count > 0);

  return (
    <div className="flex flex-wrap gap-3">
      {visibleItems.map(item => {
        const Icon = item.icon;
        return (
          <div
            key={item.status}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full
              text-sm font-medium
              ${item.colorClass}
            `}
          >
            <Icon size={14} />
            <span>{item.count}</span>
            <span className="opacity-75">{item.label}</span>
          </div>
        );
      })}
      
      <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-warm-gray">
        <span className="font-medium">{total}</span>
        <span>total</span>
      </div>
    </div>
  );
};

export default SpoilageSummary;
