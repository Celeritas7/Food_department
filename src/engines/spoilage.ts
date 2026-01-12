import { 
  Ingredient, 
  IngredientWithSpoilage, 
  SpoilageStatus 
} from '@/entities/ingredient';

/**
 * Spoilage Engine
 * 
 * Purpose: Compute expiry status for ingredients based on purchase date and shelf life.
 * 
 * This engine is PURE and DETERMINISTIC:
 * - Takes ingredient data and current time as input
 * - Returns computed spoilage information
 * - NEVER mutates any data
 */

// Configuration
const DEFAULT_NEAR_EXPIRY_THRESHOLD_DAYS = 3;

// Spoilage computation result
export interface SpoilageResult {
  expiryDate: Date | null;
  daysRemaining: number | null;
  spoilageStatus: SpoilageStatus;
}

/**
 * Compute spoilage status for a single ingredient
 * 
 * @param ingredient - The ingredient to evaluate
 * @param currentDate - Current date (defaults to now)
 * @param nearExpiryThresholdDays - Days before expiry to flag as near-expiry
 * @returns Computed spoilage information
 */
export function computeSpoilage(
  ingredient: Ingredient,
  currentDate: Date = new Date(),
  nearExpiryThresholdDays: number = DEFAULT_NEAR_EXPIRY_THRESHOLD_DAYS
): SpoilageResult {
  // Handle missing or invalid data
  if (!ingredient.purchasedAt) {
    return {
      expiryDate: null,
      daysRemaining: null,
      spoilageStatus: 'Unknown',
    };
  }

  if (!ingredient.shelfLifeDays || ingredient.shelfLifeDays <= 0) {
    return {
      expiryDate: null,
      daysRemaining: null,
      spoilageStatus: 'Unknown',
    };
  }

  // Parse purchase date
  const purchaseDate = new Date(ingredient.purchasedAt);
  
  // Validate parsed date
  if (isNaN(purchaseDate.getTime())) {
    return {
      expiryDate: null,
      daysRemaining: null,
      spoilageStatus: 'Unknown',
    };
  }

  // Compute expiry date
  const expiryDate = new Date(purchaseDate);
  expiryDate.setDate(expiryDate.getDate() + ingredient.shelfLifeDays);

  // Compute days remaining
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffMs = expiryDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(diffMs / msPerDay);

  // Determine status
  let spoilageStatus: SpoilageStatus;
  if (daysRemaining < 0) {
    spoilageStatus = 'Expired';
  } else if (daysRemaining <= nearExpiryThresholdDays) {
    spoilageStatus = 'NearExpiry';
  } else {
    spoilageStatus = 'Fresh';
  }

  return {
    expiryDate,
    daysRemaining,
    spoilageStatus,
  };
}

/**
 * Enrich an ingredient with computed spoilage data
 * 
 * @param ingredient - Base ingredient
 * @param currentDate - Current date (defaults to now)
 * @returns Ingredient with spoilage data attached
 */
export function enrichWithSpoilage(
  ingredient: Ingredient,
  currentDate: Date = new Date()
): IngredientWithSpoilage {
  const spoilage = computeSpoilage(ingredient, currentDate);
  
  return {
    ...ingredient,
    inStock: ingredient.stockQty > 0,
    expiryDate: spoilage.expiryDate,
    daysRemaining: spoilage.daysRemaining,
    spoilageStatus: spoilage.spoilageStatus,
  };
}

/**
 * Enrich multiple ingredients with spoilage data
 * 
 * @param ingredients - Array of base ingredients
 * @param currentDate - Current date (defaults to now)
 * @returns Array of ingredients with spoilage data
 */
export function enrichAllWithSpoilage(
  ingredients: Ingredient[],
  currentDate: Date = new Date()
): IngredientWithSpoilage[] {
  return ingredients.map(ing => enrichWithSpoilage(ing, currentDate));
}

/**
 * Filter ingredients by spoilage status
 * 
 * @param ingredients - Array of enriched ingredients
 * @param status - Status to filter by
 * @returns Filtered array
 */
export function filterBySpoilageStatus(
  ingredients: IngredientWithSpoilage[],
  status: SpoilageStatus
): IngredientWithSpoilage[] {
  return ingredients.filter(ing => ing.spoilageStatus === status);
}

/**
 * Get ingredients sorted by expiry urgency (most urgent first)
 * 
 * @param ingredients - Array of enriched ingredients
 * @returns Sorted array (expired first, then near-expiry, then fresh, then unknown)
 */
export function sortByExpiryUrgency(
  ingredients: IngredientWithSpoilage[]
): IngredientWithSpoilage[] {
  const statusOrder: Record<SpoilageStatus, number> = {
    'Expired': 0,
    'NearExpiry': 1,
    'Fresh': 2,
    'Unknown': 3,
  };

  return [...ingredients].sort((a, b) => {
    // First sort by status
    const statusDiff = statusOrder[a.spoilageStatus] - statusOrder[b.spoilageStatus];
    if (statusDiff !== 0) return statusDiff;

    // Then by days remaining (nulls last)
    if (a.daysRemaining === null && b.daysRemaining === null) return 0;
    if (a.daysRemaining === null) return 1;
    if (b.daysRemaining === null) return -1;
    return a.daysRemaining - b.daysRemaining;
  });
}

/**
 * Get summary statistics for spoilage
 * 
 * @param ingredients - Array of enriched ingredients
 * @returns Count of ingredients in each status
 */
export function getSpoilageSummary(
  ingredients: IngredientWithSpoilage[]
): Record<SpoilageStatus, number> {
  const summary: Record<SpoilageStatus, number> = {
    Fresh: 0,
    NearExpiry: 0,
    Expired: 0,
    Unknown: 0,
  };

  for (const ing of ingredients) {
    summary[ing.spoilageStatus]++;
  }

  return summary;
}
