/**
 * Ingredient Entity
 * 
 * Represents a physical raw ingredient that can be purchased, stored, and consumed.
 * This is the foundational entity for the cooking app.
 */

// Spoilage status enum
export type SpoilageStatus = 'Fresh' | 'NearExpiry' | 'Expired' | 'Unknown';

// Base ingredient interface (stored fields only)
export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  stockQty: number;
  shelfLifeDays: number;
  purchasedAt: string | null; // ISO date string or null
}

// Ingredient with computed spoilage data
export interface IngredientWithSpoilage extends Ingredient {
  inStock: boolean;
  expiryDate: Date | null;
  daysRemaining: number | null;
  spoilageStatus: SpoilageStatus;
}

// Form data for creating/editing ingredients
export interface IngredientFormData {
  name: string;
  unit: string;
  stockQty: number;
  shelfLifeDays: number;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate ingredient form data
 */
export function validateIngredientForm(data: IngredientFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Name validation
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Name must be 100 characters or less';
  }

  // Unit validation
  if (!data.unit || data.unit.trim() === '') {
    errors.unit = 'Unit is required';
  } else if (data.unit.length > 20) {
    errors.unit = 'Unit must be 20 characters or less';
  }

  // Stock quantity validation
  if (data.stockQty < 0) {
    errors.stockQty = 'Stock quantity cannot be negative';
  }

  // Shelf life validation
  if (!data.shelfLifeDays || data.shelfLifeDays <= 0) {
    errors.shelfLifeDays = 'Shelf life must be greater than 0';
  } else if (data.shelfLifeDays > 3650) {
    errors.shelfLifeDays = 'Shelf life cannot exceed 10 years';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Create a new ingredient with default values
 */
export function createDefaultIngredient(): IngredientFormData {
  return {
    name: '',
    unit: 'pieces',
    stockQty: 0,
    shelfLifeDays: 7,
  };
}

/**
 * Common units for ingredients
 */
export const COMMON_UNITS = [
  'pieces',
  'g',
  'kg',
  'ml',
  'L',
  'cups',
  'tbsp',
  'tsp',
  'oz',
  'lb',
  'bunch',
  'cloves',
  'slices',
] as const;
