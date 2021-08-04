import { createActions } from 'redux-actions';

export const {
  editIngredient,
  removeIngredient,
  updateIngredients,
  editIngredientAtomic,
  updateIngredientNote,
  updateIngredientsNotes,
  updateIngredientProductInfo,
  updateIngredientsProductInfo,
  updateIngredientSupplierInfo,
  updateIngredientsSupplierInfo,
} = createActions(
  'EDIT_INGREDIENT',
  'REMOVE_INGREDIENT',
  'UPDATE_INGREDIENTS',
  'EDIT_INGREDIENT_ATOMIC',
  'UPDATE_INGREDIENT_NOTE',
  'UPDATE_INGREDIENTS_NOTES',
  'UPDATE_INGREDIENT_PRODUCT_INFO',
  'UPDATE_INGREDIENTS_PRODUCT_INFO',
  'UPDATE_INGREDIENT_SUPPLIER_INFO',
  'UPDATE_INGREDIENTS_SUPPLIER_INFO',
);
