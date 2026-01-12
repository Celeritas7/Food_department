import { v4 as uuidv4 } from 'uuid';
import { db } from '@/db';
import { Ingredient, IngredientFormData } from '@/entities/ingredient';

/**
 * Ingredient CRUD Operations
 * 
 * Basic create, read, update, delete operations for ingredients.
 * These are NOT workflow actions - they are direct data manipulation.
 */

/**
 * Create a new ingredient
 * 
 * @param data - Form data for the new ingredient
 * @returns Created ingredient
 */
export async function createIngredient(data: IngredientFormData): Promise<Ingredient> {
  const ingredient: Ingredient = {
    id: uuidv4(),
    name: data.name.trim(),
    unit: data.unit.trim(),
    stockQty: data.stockQty,
    shelfLifeDays: data.shelfLifeDays,
    purchasedAt: null, // No purchase until Buy action
  };

  await db.ingredients.add(ingredient);
  return ingredient;
}

/**
 * Get all ingredients
 * 
 * @returns Array of all ingredients
 */
export async function getAllIngredients(): Promise<Ingredient[]> {
  return await db.ingredients.toArray();
}

/**
 * Get a single ingredient by ID
 * 
 * @param id - Ingredient ID
 * @returns Ingredient or undefined if not found
 */
export async function getIngredientById(id: string): Promise<Ingredient | undefined> {
  return await db.ingredients.get(id);
}

/**
 * Update an existing ingredient
 * 
 * @param id - Ingredient ID
 * @param data - Updated form data
 * @returns Updated ingredient or null if not found
 */
export async function updateIngredient(
  id: string,
  data: Partial<IngredientFormData>
): Promise<Ingredient | null> {
  const existing = await db.ingredients.get(id);
  
  if (!existing) {
    return null;
  }

  const updates: Partial<Ingredient> = {};
  
  if (data.name !== undefined) {
    updates.name = data.name.trim();
  }
  if (data.unit !== undefined) {
    updates.unit = data.unit.trim();
  }
  if (data.stockQty !== undefined) {
    updates.stockQty = data.stockQty;
  }
  if (data.shelfLifeDays !== undefined) {
    updates.shelfLifeDays = data.shelfLifeDays;
  }

  await db.ingredients.update(id, updates);
  
  const updated = await db.ingredients.get(id);
  return updated || null;
}

/**
 * Delete an ingredient
 * 
 * @param id - Ingredient ID
 * @returns true if deleted, false if not found
 */
export async function deleteIngredient(id: string): Promise<boolean> {
  const existing = await db.ingredients.get(id);
  
  if (!existing) {
    return false;
  }

  await db.ingredients.delete(id);
  return true;
}

/**
 * Search ingredients by name
 * 
 * @param query - Search query
 * @returns Matching ingredients
 */
export async function searchIngredientsByName(query: string): Promise<Ingredient[]> {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return await getAllIngredients();
  }

  const all = await db.ingredients.toArray();
  return all.filter(ing => 
    ing.name.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Get count of ingredients
 * 
 * @returns Total count
 */
export async function getIngredientCount(): Promise<number> {
  return await db.ingredients.count();
}

/**
 * Check if ingredient name already exists
 * 
 * @param name - Name to check
 * @param excludeId - Optional ID to exclude (for updates)
 * @returns true if name exists
 */
export async function ingredientNameExists(
  name: string,
  excludeId?: string
): Promise<boolean> {
  const normalizedName = name.toLowerCase().trim();
  const all = await db.ingredients.toArray();
  
  return all.some(ing => 
    ing.name.toLowerCase() === normalizedName && ing.id !== excludeId
  );
}
