import Dexie, { Table } from 'dexie';
import { Ingredient } from '@/entities/ingredient';

/**
 * CookingAppDB
 * 
 * Local-first database using Dexie.js (IndexedDB wrapper).
 * All data is stored locally and persists across sessions.
 */
export class CookingAppDB extends Dexie {
  // Declare tables
  ingredients!: Table<Ingredient, string>;

  constructor() {
    super('CookingAppDB');

    // Define schema
    // Version 1: Ingredients only (Phase 1)
    this.version(1).stores({
      // Primary key is 'id', indexed fields: name, purchasedAt
      ingredients: 'id, name, purchasedAt',
    });
  }
}

// Create singleton instance
export const db = new CookingAppDB();

/**
 * Clear all data (for testing/reset)
 */
export async function clearAllData(): Promise<void> {
  await db.ingredients.clear();
}

/**
 * Get database statistics
 */
export async function getDbStats(): Promise<{ ingredientCount: number }> {
  const ingredientCount = await db.ingredients.count();
  return { ingredientCount };
}
