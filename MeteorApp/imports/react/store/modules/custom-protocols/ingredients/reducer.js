import {
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
} from './actions';

export default {
  [editIngredient]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      ingredients: {
        ...state.ingredients,
        [id]: {
          ...state.ingredients[id],
          ...rest,
        },
      },
    };
  },
  [removeIngredient]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    ingredients: {
      ...state.ingredients,
      [id]: {
        ...state.ingredients[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateIngredients]: (state, { payload: { data } }) => ({
    ...state,
    ingredients: {
      ...state.ingredients,
      ...data,
    },
  }),
  [editIngredientAtomic]: (state, { payload: { data: { id, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    ingredients: {
      ...state.ingredients,
      [id]: {
        ...state.ingredients[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
  [updateIngredientProductInfo]: (state, { payload: { id, fields } }) => ({
    ...state,
    ingredients: {
      ...state.ingredients,
      [+id]: {
        ...state.ingredients[+id],
        productInfo: {
          ...state.ingredients[+id].productInfo,
          ...fields,
        },
      },
    },
  }),
  [updateIngredientsProductInfo]: (state, { payload: { data } }) => Object
    .values(data)
    .reduce((res, info) => ({
      ...res,
      ingredients: {
        ...res.ingredients,
        [+info.id]: {
          ...res.ingredients[+info.id],
          productInfo: info,
        },
      },
    }), state),
  [updateIngredientSupplierInfo]: (state, { payload: { id, fields } }) => ({
    ...state,
    ingredients: {
      ...state.ingredients,
      [+fields.ingredientId]: {
        ...state.ingredients[+fields.ingredientId],
        supplierInfo: {
          ...state.ingredients[+fields.ingredientId].supplierInfo,
          [id]: fields,
        },
      },
    },
  }),
  [updateIngredientsSupplierInfo]: (state, { payload: { data } }) => Object
    .values(data)
    .reduce((res, info) => ({
      ...res,
      ingredients: {
        ...res.ingredients,
        [+info.ingredientId]: {
          ...res.ingredients[+info.ingredientId],
          supplierInfo: {
            ...res.ingredients[+info.ingredientId].supplierInfo,
            [+info.id]: info,
          },
        },
      },
    }), state),
  [updateIngredientNote]: (state, { payload: { id, fields } }) => ({
    ...state,
    ingredients: {
      ...state.ingredients,
      [+fields.ingredientId]: {
        ...state.ingredients[+fields.ingredientId],
        notes: {
          ...state.ingredients[+fields.ingredientId].notes,
          [id]: fields,
        },
      },
    },
  }),
  [updateIngredientsNotes]: (state, { payload: { data } }) => Object
    .values(data)
    .reduce((res, note) => ({
      ...res,
      ingredients: {
        ...res.ingredients,
        [+note.ingredientId]: {
          ...res.ingredients[+note.ingredientId],
          notes: {
            ...res.ingredients[+note.ingredientId].notes,
            [+note.id]: note,
          },
        },
      },
    }), state),
};
