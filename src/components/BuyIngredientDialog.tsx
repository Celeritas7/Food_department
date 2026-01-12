import React, { useState } from 'react';
import { IngredientWithSpoilage } from '@/entities/ingredient';
import { ShoppingCart, Package, ArrowRight } from 'lucide-react';

interface BuyIngredientDialogProps {
  ingredient: IngredientWithSpoilage;
  onConfirm: (quantity: number) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Dialog for recording an ingredient purchase
 */
export const BuyIngredientDialog: React.FC<BuyIngredientDialogProps> = ({
  ingredient,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const newStock = ingredient.stockQty + quantity;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    setQuantity(value);
    
    if (value <= 0) {
      setError('Quantity must be greater than 0');
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    await onConfirm(quantity);
  };

  // Quick add buttons
  const quickAddAmounts = [1, 5, 10];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Ingredient info */}
      <div className="bg-warm-white rounded-xl p-4">
        <h3 className="font-display text-lg text-charcoal mb-2">
          {ingredient.name}
        </h3>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-warm-gray" />
            <span className="text-warm-gray">Current:</span>
            <span className="font-medium text-charcoal">
              {ingredient.stockQty} {ingredient.unit}
            </span>
          </div>
        </div>
      </div>

      {/* Quantity input */}
      <div>
        <label 
          htmlFor="quantity" 
          className="block text-sm font-medium text-charcoal mb-1"
        >
          Purchase Quantity ({ingredient.unit})
        </label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={handleQuantityChange}
          min="0.1"
          step="0.1"
          className={`
            w-full px-4 py-3 rounded-lg border text-lg
            text-charcoal
            focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta
            transition-colors
            ${error 
              ? 'border-tomato bg-tomato/5' 
              : 'border-light-gray/50 bg-white'
            }
          `}
          disabled={isLoading}
          autoFocus
        />
        {error && (
          <p className="mt-1 text-sm text-tomato">{error}</p>
        )}
      </div>

      {/* Quick add buttons */}
      <div className="flex gap-2">
        {quickAddAmounts.map(amount => (
          <button
            key={amount}
            type="button"
            onClick={() => {
              setQuantity(amount);
              setError(null);
            }}
            className={`
              flex-1 px-3 py-2 rounded-lg border text-sm font-medium
              transition-colors
              ${quantity === amount
                ? 'border-terracotta bg-terracotta/10 text-terracotta'
                : 'border-light-gray/50 text-warm-gray hover:border-terracotta/50 hover:text-terracotta'
              }
            `}
            disabled={isLoading}
          >
            +{amount}
          </button>
        ))}
      </div>

      {/* Stock preview */}
      <div className="bg-sage/10 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-warm-gray">
            <span>Current stock</span>
            <div className="font-medium text-charcoal text-lg">
              {ingredient.stockQty} {ingredient.unit}
            </div>
          </div>
          
          <ArrowRight size={20} className="text-sage" />
          
          <div className="text-sm text-warm-gray text-right">
            <span>After purchase</span>
            <div className="font-medium text-sage-dark text-lg">
              {newStock.toFixed(1)} {ingredient.unit}
            </div>
          </div>
        </div>
      </div>

      {/* Note about freshness */}
      <p className="text-xs text-warm-gray">
        Purchase date will be set to today. Expiry will be calculated based on shelf life ({ingredient.shelfLifeDays} days).
      </p>

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
          Cancel
        </button>
        <button
          type="submit"
          className="
            flex-1 px-4 py-2.5 rounded-lg
            bg-terracotta text-white font-medium
            hover:bg-terracotta-dark
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
            flex items-center justify-center gap-2
          "
          disabled={isLoading || quantity <= 0}
        >
          <ShoppingCart size={18} />
          {isLoading ? 'Recording...' : 'Record Purchase'}
        </button>
      </div>
    </form>
  );
};

export default BuyIngredientDialog;
