import { dispatch } from 'store';

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
} from 'store/actions';

import { api } from '../..';

const getSeqId = (cb) => {
  api.get('/api/ingredient/getIngredientNextId').then(({ data: { id } }) => {
    cb(parseInt(id, 10) + 1);
  });
};

const handleGetAllIngredientProductInfo = () => new Promise((resolve, reject) => {
  api.get('/api/ingredient/fetchAllIngredientProductInfo').then(({ data }) => {
    if (data.error) reject();
    else {
      dispatch(updateIngredientsProductInfo({ data: data.data, section: 'productInfo' }));
      resolve();
    }
  });
});

const handleGetAllIngredientSupplierInfo = () => new Promise((resolve, reject) => {
  api.get('/api/ingredient-supplier/fetchAllIngredientSuppliers').then(({ data }) => {
    if (data.error) reject();
    else {
      dispatch(updateIngredientsSupplierInfo({ data: data.data }));
      resolve();
    }
  });
});

const handleGetAllIngredientNotes = () => new Promise((resolve, reject) => {
  api.get('/api/ingredient-note/fetchAllIngredientNotes').then(({ data }) => {
    if (data.error) reject();
    else {
      dispatch(updateIngredientsNotes({ data: data.data }));
      resolve();
    }
  });
});

const getAllIngredients = () => {
  api.get('/api/ingredient/fetchAllIngredients').then(({ data }) => {
    if (data.error) dispatch(updateIngredients({}));
    else {
      dispatch(updateIngredients({ data: data.data }));
      Promise.all([
        handleGetAllIngredientProductInfo(),
        handleGetAllIngredientSupplierInfo(),
        handleGetAllIngredientNotes(),
      ]);
    }
  });
};

const handleIngredientCreate = (formData, cb) => {
  api
    .post('api/ingredient/createIngredient', { ...formData })
    .then(({ data: { error, id } }) => {
      if (error) cb({ error: true });
      else {
        const ingredient = {
          [+id]: {
            id: +id,
            ...formData,
          },
        };
        dispatch(updateIngredients({ data: ingredient }));
        cb({ error: false, id });
      }
    })
    .catch(() => cb({ error: true }));
};

const handleUpdateProductInfo = (formData) => new Promise((resolve, reject) => {
  const filteredFields = {
    id: formData.id,
    productDescription: formData.productDescription,
    direction: formData.direction,
    conditionsUsedFor: formData.conditionsUsedFor,
    allergens: formData.allergens,
    caution: formData.caution,
    effectiveness: formData.effectiveness,
    ingredients: formData.ingredients,
  };

  api
    .post('/api/ingredient/updateIngredientProductInfo', filteredFields)
    .then(({ data }) => {
      if (data.error) reject();
      else {
        dispatch(updateIngredientProductInfo({ id: formData.id, fields: filteredFields }));
        resolve();
      }
    });
});

const handleIngredientEdit = (formData, cb) => {
  api.post('/api/ingredient/editIngredient', { ...formData })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        const ingredientData = {
          id: formData.id,
          ingredientName: formData.ingredientName,
          ingredientCategory: formData.ingredientCategory,
          ingredientType: formData.ingredientType,
          measurements: formData.measurements,
          purchase: formData.purchase,
          updatedAt: formData.updatedAt,
          updatedBy: formData.updatedBy,
        };
        dispatch(editIngredient({ data: { ...ingredientData } }));
        Promise
          .all([
            handleUpdateProductInfo(formData),
          ])
          .then(() => cb({ error: false, done: true }))
          .catch(() => cb({ error: true, done: false }));
      }
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleIngredientEditAtomic = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/ingredient/editIngredientAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editIngredientAtomic({ data: { id, field, value, updatedAt, updatedBy } }));
      }
    });
};

const handleIngredientRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/ingredient/removeIngredient', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeIngredient({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

const handleIngredientSupplierCreate = (formData, cb) => {
  api
    .post('/api/ingredient-supplier/createIngredientSupplier', { ...formData })
    .then(({ data: { error, id } }) => {
      if (error) cb(false);
      else {
        dispatch(updateIngredientSupplierInfo({ id: +id, fields: { ...formData, id: +id } }));
        cb(true);
      }
    })
    .catch(() => cb(false));
};

const handleIngredientSupplierEdit = (formData, cb) => {
  api
    .post('/api/ingredient-supplier/editIngredientSupplier', { ...formData })
    .then(({ data: { error } }) => {
      if (error) cb(false);
      else {
        dispatch(updateIngredientSupplierInfo({ id: formData.id, fields: formData }));
        cb(true);
      }
    })
    .catch(() => cb(false));
};

const handleIngredientSupplierDelete = (formData, cb) => {
  api
    .post('/api/ingredient-supplier/removeIngredientSupplier', { ...formData })
    .then(() => {
      dispatch(updateIngredientSupplierInfo({ id: formData.id, fields: formData }));
      cb();
    })
    .catch(() => cb());
};

const handleIngredientPostCreate = (formData, cb) => {
  api
    .post('/api/ingredient-note/createIngredientNote', { ...formData })
    .then(({ data: { error, id } }) => {
      if (error) cb(false);
      else {
        dispatch(updateIngredientNote({ id: +id, fields: { ...formData, id: +id } }));
        cb(true);
      }
    })
    .catch(() => cb(false));
};

export default {
  getSeqId,
  getAllIngredients,
  handleIngredientEdit,
  handleIngredientCreate,
  handleIngredientRemove,
  handleIngredientPostCreate,
  handleIngredientEditAtomic,
  handleIngredientSupplierEdit,
  handleIngredientSupplierCreate,
  handleIngredientSupplierDelete,
};
