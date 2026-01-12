import { db } from '@/db';
import { Ingredient } from '@/entities/ingredient';

/**
 * Buy Ingredient Action
 * 
 * Purpose: Record a purchase of an ingredient, incrementing stock and resetting freshness tracking.
 * 
 * This is a WORKFLOW ACTION that MUTATES state.
 * - Validates preconditions before mutation
 * - Executes atomically (all-or-nothing)
 * - Returns result indicating success/failure
 */

// Action input parameters
export interface BuyIngredientInput {
  ingredientId: string;
  purchasedQty: number;
}

// Action result
export interface BuyIngredientResult {
  success: boolean;
  error: string | null;
  updatedIngredient: Ingredient | null;
  previousStockQty: number | null;
  newStockQty: number | null;
}

// Audit record for future undo support
export interface BuyIngredientAudit {
  actionType: 'BUY_INGREDIENT';
  timestamp: string;
  ingredientId: string;
  purchasedQty: number;
  previousStockQty: number;
  newStockQty: number;
}

/**
 * Execute Buy Ingredient action
 * 
 * @param input - Action parameters
 * @returns Result indicating success/failure with updated data
 */
export async function buyIngredient(
  input: BuyIngredientInput
): Promise<BuyIngredientResult> {
  const { ingredientId, purchasedQty } = input;

  // Validate: quantity must be positive
  if (purchasedQty <= 0) {
    return {
      success: false,
      error: 'Purchase quantity must be greater than 0',
      updatedIngredient: null,
      previousStockQty: null,
      newStockQty: null,
    };
  }

  // Validate: quantity must be a finite number
  if (!Number.isFinite(purchasedQty)) {
    return {
      success: false,
      error: 'Purchase quantity must be a valid number',
      updatedIngredient: null,
      previousStockQty: null,
      newStockQty: null,
    };
  }

  try {
    // Execute in transaction for atomicity
    const result = await db.transaction('rw', db.ingredients, async () => {
      // Fetch ingredient
      const ingredient = await db.ingredients.get(ingredientId);
      
      if (!ingredient) {
        throw new Error('Ingredient not found');
      }

      const previousStockQty = ingredient.stockQty;
      const newStockQty = previousStockQty + purchasedQty;
      const newPurchasedAt = new Date().toISOString();

      // Update ingredient
      await db.ingredients.update(ingredientId, {
        stockQty: newStockQty,
        purchasedAt: newPurchasedAt,
      });

      // Fetch updated ingredient
      const updatedIngredient = await db.ingredients.get(ingredientId);

      return {
        updatedIngredient: updatedIngredient!,
        previousStockQty,
        newStockQty,
      };
    });

    return {
      success: true,
      error: null,
      updatedIngredient: result.updatedIngredient,
      previousStockQty: result.previousStockQty,
      newStockQty: result.newStockQty,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      updatedIngredient: null,
      previousStockQty: null,
      newStockQty: null,
    };
  }
}

/**
 * Create audit record for a successful buy action
 * 
 * @param input - Action input
 * @param result - Action result
 * @returns Audit record
 */
export function createBuyAuditRecord(
  input: BuyIngredientInput,
  result: BuyIngredientResult
): BuyIngredientAudit | null {
  if (!result.success || result.previousStockQty === null || result.newStockQty === null) {
    return null;
  }

  return {
    actionType: 'BUY_INGREDIENT',
    timestamp: new Date().toISOString(),
    ingredientId: input.ingredientId,
    purchasedQty: input.purchasedQty,
    previousStockQty: result.previousStockQty,
    newStockQty: result.newStockQty,
  };
}
