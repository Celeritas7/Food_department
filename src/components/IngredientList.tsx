import React from 'react';
import { IngredientWithSpoilage } from '@/entities/ingredient';
import { IngredientCard } from './IngredientCard';
import { Package, Plus } from 'lucide-react';

interface IngredientListProps {
  ingredients: IngredientWithSpoilage[];
  onBuy: (ingredient: IngredientWithSpoilage) => void;
  onEdit: (ingredient: IngredientWithSpoilage) => void;
  onDelete: (ingredient: IngredientWithSpoilage) => void;
  onAddNew: () => void;
  isLoading?: boolean;
}

/**
 * List of ingredient cards with empty state
 */
export const IngredientList: React.FC<IngredientListProps> = ({
  ingredients,
  onBuy,
  onEdit,
  onDelete,
  onAddNew,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-warm-gray">Loading ingredients...</p>
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-light-gray/30 flex items-center justify-center mb-4">
          <Package size={32} className="text-light-gray" />
        </div>
        <h3 className="font-display text-lg text-charcoal mb-2">
          No ingredients yet
        </h3>
        <p className="text-warm-gray text-center mb-6 max-w-xs">
          Start by adding the ingredients you commonly use in your cooking.
        </p>
        <button
          onClick={onAddNew}
          className="
            flex items-center gap-2
            px-5 py-2.5 rounded-lg
            bg-terracotta text-white font-medium
            hover:bg-terracotta-dark
            transition-colors
          "
        >
          <Plus size={18} />
          Add First Ingredient
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
      {ingredients.map(ingredient => (
        <IngredientCard
          key={ingredient.id}
          ingredient={ingredient}
          onBuy={onBuy}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default IngredientList;
