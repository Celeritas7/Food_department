import React, { useState, useEffect } from 'react';
import { 
  IngredientFormData, 
  validateIngredientForm,
  createDefaultIngredient,
  COMMON_UNITS,
  Ingredient,
} from '@/entities/ingredient';

interface IngredientFormProps {
  initialData?: Ingredient;
  onSubmit: (data: IngredientFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Form for creating or editing an ingredient
 */
export const IngredientForm: React.FC<IngredientFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<IngredientFormData>(
    initialData 
      ? {
          name: initialData.name,
          unit: initialData.unit,
          stockQty: initialData.stockQty,
          shelfLifeDays: initialData.shelfLifeDays,
        }
      : createDefaultIngredient()
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isEditMode = !!initialData;

  // Validate on change
  useEffect(() => {
    const result = validateIngredientForm(formData);
    setErrors(result.errors);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields
    setTouched({
      name: true,
      unit: true,
      stockQty: true,
      shelfLifeDays: true,
    });

    const result = validateIngredientForm(formData);
    
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    await onSubmit(formData);
  };

  const getFieldError = (field: string) => {
    return touched[field] ? errors[field] : undefined;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name field */}
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-medium text-charcoal mb-1"
        >
          Name <span className="text-tomato">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., Tomato, Chicken Breast"
          className={`
            w-full px-4 py-2.5 rounded-lg border
            text-charcoal placeholder-light-gray
            focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta
            transition-colors
            ${getFieldError('name') 
              ? 'border-tomato bg-tomato/5' 
              : 'border-light-gray/50 bg-white'
            }
          `}
          disabled={isLoading}
        />
        {getFieldError('name') && (
          <p className="mt-1 text-sm text-tomato">{getFieldError('name')}</p>
        )}
      </div>

      {/* Unit field */}
      <div>
        <label 
          htmlFor="unit" 
          className="block text-sm font-medium text-charcoal mb-1"
        >
          Unit <span className="text-tomato">*</span>
        </label>
        <select
          id="unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`
            w-full px-4 py-2.5 rounded-lg border
            text-charcoal
            focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta
            transition-colors
            ${getFieldError('unit') 
              ? 'border-tomato bg-tomato/5' 
              : 'border-light-gray/50 bg-white'
            }
          `}
          disabled={isLoading}
        >
          {COMMON_UNITS.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
        {getFieldError('unit') && (
          <p className="mt-1 text-sm text-tomato">{getFieldError('unit')}</p>
        )}
      </div>

      {/* Stock Quantity field */}
      <div>
        <label 
          htmlFor="stockQty" 
          className="block text-sm font-medium text-charcoal mb-1"
        >
          Current Stock
        </label>
        <input
          type="number"
          id="stockQty"
          name="stockQty"
          value={formData.stockQty}
          onChange={handleChange}
          onBlur={handleBlur}
          min="0"
          step="0.1"
          placeholder="0"
          className={`
            w-full px-4 py-2.5 rounded-lg border
            text-charcoal placeholder-light-gray
            focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta
            transition-colors
            ${getFieldError('stockQty') 
              ? 'border-tomato bg-tomato/5' 
              : 'border-light-gray/50 bg-white'
            }
          `}
          disabled={isLoading}
        />
        {getFieldError('stockQty') && (
          <p className="mt-1 text-sm text-tomato">{getFieldError('stockQty')}</p>
        )}
        <p className="mt-1 text-xs text-warm-gray">
          Use the "Buy" button to add stock with freshness tracking
        </p>
      </div>

      {/* Shelf Life field */}
      <div>
        <label 
          htmlFor="shelfLifeDays" 
          className="block text-sm font-medium text-charcoal mb-1"
        >
          Shelf Life (days) <span className="text-tomato">*</span>
        </label>
        <input
          type="number"
          id="shelfLifeDays"
          name="shelfLifeDays"
          value={formData.shelfLifeDays}
          onChange={handleChange}
          onBlur={handleBlur}
          min="1"
          max="3650"
          placeholder="7"
          className={`
            w-full px-4 py-2.5 rounded-lg border
            text-charcoal placeholder-light-gray
            focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta
            transition-colors
            ${getFieldError('shelfLifeDays') 
              ? 'border-tomato bg-tomato/5' 
              : 'border-light-gray/50 bg-white'
            }
          `}
          disabled={isLoading}
        />
        {getFieldError('shelfLifeDays') && (
          <p className="mt-1 text-sm text-tomato">{getFieldError('shelfLifeDays')}</p>
        )}
        <p className="mt-1 text-xs text-warm-gray">
          How many days this ingredient stays fresh after purchase
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-light-gray/30">
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
          "
          disabled={isLoading}
        >
          {isLoading 
            ? 'Saving...' 
            : isEditMode 
              ? 'Update Ingredient' 
              : 'Add Ingredient'
          }
        </button>
      </div>
    </form>
  );
};

export default IngredientForm;
