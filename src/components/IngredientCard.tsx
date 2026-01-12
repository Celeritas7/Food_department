import React from 'react';
import { IngredientWithSpoilage } from '@/entities/ingredient';
import { SpoilageBadge } from './SpoilageBadge';
import { ShoppingCart, Edit2, Trash2, Package } from 'lucide-react';

interface IngredientCardProps {
  ingredient: IngredientWithSpoilage;
  onBuy: (ingredient: IngredientWithSpoilage) => void;
  onEdit: (ingredient: IngredientWithSpoilage) => void;
  onDelete: (ingredient: IngredientWithSpoilage) => void;
}

/**
 * Card displaying a single ingredient with its status and actions
 */
export const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient,
  onBuy,
  onEdit,
  onDelete,
}) => {
  const stockDisplay = ingredient.inStock 
    ? `${ingredient.stockQty} ${ingredient.unit}`
    : 'Out of stock';

  return (
    <div 
      className="
        bg-white rounded-xl border border-light-gray/30 
        shadow-soft hover:shadow-medium
        transition-all duration-200
        overflow-hidden
        animate-fadeIn
      "
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg text-charcoal truncate">
              {ingredient.name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <Package size={14} className="text-warm-gray" />
              <span 
                className={`text-sm font-medium ${
                  ingredient.inStock ? 'text-charcoal' : 'text-tomato'
                }`}
              >
                {stockDisplay}
              </span>
            </div>
          </div>
          
          <SpoilageBadge 
            status={ingredient.spoilageStatus}
            daysRemaining={ingredient.daysRemaining}
            size="sm"
          />
        </div>
      </div>

      {/* Shelf life info */}
      <div className="px-4 pb-3">
        <p className="text-xs text-warm-gray">
          Shelf life: {ingredient.shelfLifeDays} days
        </p>
      </div>

      {/* Actions */}
      <div className="border-t border-light-gray/30 bg-warm-white/50 px-2 py-2 flex gap-1">
        <button
          onClick={() => onBuy(ingredient)}
          className="
            flex-1 flex items-center justify-center gap-1.5
            px-3 py-2 rounded-lg
            text-sm font-medium
            text-terracotta hover:bg-terracotta/10
            transition-colors
          "
          title="Record purchase"
        >
          <ShoppingCart size={16} />
          <span>Buy</span>
        </button>
        
        <button
          onClick={() => onEdit(ingredient)}
          className="
            flex items-center justify-center
            px-3 py-2 rounded-lg
            text-warm-gray hover:bg-light-gray/30 hover:text-charcoal
            transition-colors
          "
          title="Edit ingredient"
        >
          <Edit2 size={16} />
        </button>
        
        <button
          onClick={() => onDelete(ingredient)}
          className="
            flex items-center justify-center
            px-3 py-2 rounded-lg
            text-warm-gray hover:bg-tomato/10 hover:text-tomato
            transition-colors
          "
          title="Delete ingredient"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default IngredientCard;
