import React, { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { 
  IngredientWithSpoilage, 
  IngredientFormData,
  Ingredient,
} from '@/entities/ingredient';
import { enrichAllWithSpoilage, sortByExpiryUrgency } from '@/engines/spoilage';
import { 
  createIngredient, 
  updateIngredient, 
  deleteIngredient,
} from '@/actions/ingredientCrud';
import { buyIngredient } from '@/actions/buyIngredient';
import {
  IngredientList,
  IngredientForm,
  BuyIngredientDialog,
  ConfirmDialog,
  Modal,
  SpoilageSummary,
} from '@/components';
import { Plus, ChefHat, RefreshCw } from 'lucide-react';

type ModalState = 
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; ingredient: Ingredient }
  | { type: 'buy'; ingredient: IngredientWithSpoilage }
  | { type: 'delete'; ingredient: IngredientWithSpoilage };

/**
 * Main page for managing ingredients
 */
export const IngredientsPage: React.FC = () => {
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [isLoading, setIsLoading] = useState(false);
  const [sortByExpiry, setSortByExpiry] = useState(false);

  // Live query for ingredients
  const rawIngredients = useLiveQuery(
    () => db.ingredients.toArray(),
    []
  );

  // Enrich with spoilage data
  const ingredients: IngredientWithSpoilage[] = React.useMemo(() => {
    if (!rawIngredients) return [];
    
    const enriched = enrichAllWithSpoilage(rawIngredients);
    
    if (sortByExpiry) {
      return sortByExpiryUrgency(enriched);
    }
    
    // Default: sort by name
    return enriched.sort((a, b) => a.name.localeCompare(b.name));
  }, [rawIngredients, sortByExpiry]);

  // Modal handlers
  const closeModal = useCallback(() => {
    setModalState({ type: 'none' });
  }, []);

  const openAddModal = useCallback(() => {
    setModalState({ type: 'add' });
  }, []);

  const openEditModal = useCallback((ingredient: IngredientWithSpoilage) => {
    setModalState({ type: 'edit', ingredient });
  }, []);

  const openBuyModal = useCallback((ingredient: IngredientWithSpoilage) => {
    setModalState({ type: 'buy', ingredient });
  }, []);

  const openDeleteModal = useCallback((ingredient: IngredientWithSpoilage) => {
    setModalState({ type: 'delete', ingredient });
  }, []);

  // Action handlers
  const handleAddIngredient = useCallback(async (data: IngredientFormData) => {
    setIsLoading(true);
    try {
      await createIngredient(data);
      closeModal();
    } catch (error) {
      console.error('Failed to add ingredient:', error);
    } finally {
      setIsLoading(false);
    }
  }, [closeModal]);

  const handleEditIngredient = useCallback(async (data: IngredientFormData) => {
    if (modalState.type !== 'edit') return;
    
    setIsLoading(true);
    try {
      await updateIngredient(modalState.ingredient.id, data);
      closeModal();
    } catch (error) {
      console.error('Failed to update ingredient:', error);
    } finally {
      setIsLoading(false);
    }
  }, [modalState, closeModal]);

  const handleBuyIngredient = useCallback(async (quantity: number) => {
    if (modalState.type !== 'buy') return;
    
    setIsLoading(true);
    try {
      const result = await buyIngredient({
        ingredientId: modalState.ingredient.id,
        purchasedQty: quantity,
      });
      
      if (!result.success) {
        console.error('Failed to buy ingredient:', result.error);
        return;
      }
      
      closeModal();
    } catch (error) {
      console.error('Failed to buy ingredient:', error);
    } finally {
      setIsLoading(false);
    }
  }, [modalState, closeModal]);

  const handleDeleteIngredient = useCallback(async () => {
    if (modalState.type !== 'delete') return;
    
    setIsLoading(true);
    try {
      await deleteIngredient(modalState.ingredient.id);
      closeModal();
    } catch (error) {
      console.error('Failed to delete ingredient:', error);
    } finally {
      setIsLoading(false);
    }
  }, [modalState, closeModal]);

  const isDataLoading = rawIngredients === undefined;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-light-gray/30 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center">
                <ChefHat size={24} className="text-terracotta" />
              </div>
              <div>
                <h1 className="font-display text-xl text-charcoal">
                  Ingredients
                </h1>
                <p className="text-sm text-warm-gray">
                  Manage your kitchen inventory
                </p>
              </div>
            </div>

            <button
              onClick={openAddModal}
              className="
                flex items-center gap-2
                px-4 py-2.5 rounded-lg
                bg-terracotta text-white font-medium
                hover:bg-terracotta-dark
                transition-colors
                shadow-soft
              "
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Ingredient</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Toolbar */}
        {ingredients.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <SpoilageSummary ingredients={ingredients} />
            
            <button
              onClick={() => setSortByExpiry(!sortByExpiry)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-colors
                ${sortByExpiry
                  ? 'bg-terracotta/10 text-terracotta'
                  : 'text-warm-gray hover:bg-light-gray/30'
                }
              `}
            >
              <RefreshCw size={16} />
              {sortByExpiry ? 'Sorted by expiry' : 'Sort by expiry'}
            </button>
          </div>
        )}

        {/* Ingredient list */}
        <IngredientList
          ingredients={ingredients}
          onBuy={openBuyModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onAddNew={openAddModal}
          isLoading={isDataLoading}
        />
      </main>

      {/* Add Modal */}
      <Modal
        isOpen={modalState.type === 'add'}
        onClose={closeModal}
        title="Add Ingredient"
      >
        <IngredientForm
          onSubmit={handleAddIngredient}
          onCancel={closeModal}
          isLoading={isLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={modalState.type === 'edit'}
        onClose={closeModal}
        title="Edit Ingredient"
      >
        {modalState.type === 'edit' && (
          <IngredientForm
            initialData={modalState.ingredient}
            onSubmit={handleEditIngredient}
            onCancel={closeModal}
            isLoading={isLoading}
          />
        )}
      </Modal>

      {/* Buy Modal */}
      <Modal
        isOpen={modalState.type === 'buy'}
        onClose={closeModal}
        title="Record Purchase"
      >
        {modalState.type === 'buy' && (
          <BuyIngredientDialog
            ingredient={modalState.ingredient}
            onConfirm={handleBuyIngredient}
            onCancel={closeModal}
            isLoading={isLoading}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalState.type === 'delete'}
        onClose={closeModal}
        title="Delete Ingredient"
        size="sm"
      >
        {modalState.type === 'delete' && (
          <ConfirmDialog
            title={`Delete "${modalState.ingredient.name}"?`}
            message="This action cannot be undone. The ingredient will be permanently removed from your inventory."
            confirmLabel="Delete"
            onConfirm={handleDeleteIngredient}
            onCancel={closeModal}
            isLoading={isLoading}
            variant="danger"
          />
        )}
      </Modal>
    </div>
  );
};

export default IngredientsPage;
