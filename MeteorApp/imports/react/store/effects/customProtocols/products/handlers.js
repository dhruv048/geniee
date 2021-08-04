import { dispatch } from 'store';

import {
  editProduct,
  removeProduct,
  updateProducts,
  updateProductImage,
  updateProductNote,
  updateProductsNotes,
  updateProductSupplierInfo,
  updateProductsSupplierInfo,
} from 'store/actions';

import { api } from '../..';
import { uploadFile } from '../../admin/handlers';

const handleGetAllProductSuppliers = () => new Promise((resolve, reject) => {
  api.get('/api/product-supplier/fetchAllProductSuppliers').then(({ data }) => {
    if (data.error) reject();
    else {
      dispatch(updateProductsSupplierInfo({ data: data.data }));
      resolve();
    }
  });
});

const handleGetAllProductNotes = () => new Promise((resolve, reject) => {
  api.get('/api/product-note/fetchAllProductNotes').then(({ data }) => {
    if (data.error) reject();
    else {
      dispatch(updateProductsNotes({ data: data.data }));
      resolve();
    }
  });
});

const getAllProducts = () => {
  api.get('/api/product/fetchAllProducts').then(({ data }) => {
    if (data.error) dispatch(updateProducts({}));
    else {
      dispatch(updateProducts({ data: data.data }));
      Promise.all([
        handleGetAllProductSuppliers(),
        handleGetAllProductNotes(),
      ]);
    }
  });
};

const handleProductSupplierCreate = ({ productId, formData }) => new Promise((resolve, reject) => {
  const { supplier: supplierId, isPrimary, purchasingNotes } = formData;

  if (supplierId) {
    api
      .post('/api/product-supplier/createProductSupplier', { productId, supplierId, isPrimary, purchasingNotes })
      .then(({ data: { error, id } }) => {
        if (error) reject();
        else {
          dispatch(updateProductSupplierInfo({
            id: +id,
            fields: {
              id: +id,
              productId,
              supplierId,
              isPrimary,
              purchasingNotes,
            },
          }));
          resolve();
        }
      })
      .catch(() => reject());
  } else {
    resolve();
  }
});

const handleProductCreate = (formData, cb) => {
  const { image } = formData;

  const promise = new Promise((resolve, reject) => {
    if (image) {
      uploadFile(image)
        .then(({ imageUrl }) => resolve({ imageUrl }))
        .catch(() => reject());
    } else resolve({ imageUrl: null });
  });

  promise
    .then(({ imageUrl }) => api
      .post('api/product/createProduct', { ...formData, imageUrl })
      .then(({ data: { error, id } }) => {
        if (error) cb({ error: true });
        else {
          const { suppliers, ...rest } = formData;
          const product = {
            [+id]: {
              id: +id,
              ...rest,
            },
          };
          dispatch(updateProducts({ data: product }));

          Promise
            .all(
              Object
                .values(suppliers)
                .map((supplier) => handleProductSupplierCreate({ productId: +id, formData: supplier })),
            )
            .then(() => cb({ error: false, id }))
            .catch(() => cb({ error: true }));
        }
      }))
    .catch(() => cb({ error: true }));
};

const handleProductEdit = (formData, cb) => {
  const { image } = formData;

  const promise = new Promise((resolve, reject) => {
    if (image) {
      uploadFile(image)
        .then(({ imageUrl }) => resolve({ imageUrl }))
        .catch(() => reject());
    } else resolve({ imageUrl: null });
  });

  promise
    .then(({ imageUrl }) => {
      api.post('/api/product/editProduct', { ...formData, imageUrl })
        .then(({ data: { error } }) => {
          if (error) cb({ error: true, done: false });
          else {
            if (imageUrl) {
              const { image: imageObj, ...rest } = formData;
              dispatch(editProduct({ data: { ...rest, imageUrl } }));
            } else {
              const { image: imageObj, ...rest } = formData;
              dispatch(editProduct({ data: { ...rest } }));
            }
            cb({ error: false, done: true });
          }
        })
        .catch(() => cb({ error: true, done: false }));
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleProductRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/product/removeProduct', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeProduct({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

const updateImage = ({ id, file }, cb) => {
  const promise = new Promise((resolve, reject) => {
    if (file) {
      uploadFile(file)
        .then(({ imageUrl }) => resolve({ imageUrl }))
        .catch(() => reject());
    } else resolve({ imageUrl: null });
  });

  promise
    .then(({ imageUrl }) => {
      api.post('/api/product/updateProductImage', { id, imageUrl })
        .then(({ data: { error } }) => {
          if (error) cb(false);
          else {
            dispatch(updateProductImage({ data: { id, imageUrl } }));
            cb(true);
          }
        })
        .catch(() => cb(false));
    })
    .catch(() => cb(false));
};

const handleProductSupplierEdit = (formData, cb) => {
  api
    .post('/api/product-supplier/editProductSupplier', { ...formData })
    .then(({ data: { error } }) => {
      if (error) cb(false);
      else {
        dispatch(updateProductSupplierInfo({ id: formData.id, fields: formData }));
        cb(true);
      }
    })
    .catch(() => cb(false));
};

const handleProductSupplierDelete = (formData, cb) => {
  api
    .post('/api/product-supplier/removeProductSupplier', { ...formData })
    .then(() => {
      dispatch(updateProductSupplierInfo({ id: formData.id, fields: formData }));
      cb();
    })
    .catch(() => cb());
};

const handleProductPostCreate = (formData, cb) => {
  api
    .post('/api/product-note/createProductNote', { ...formData })
    .then(({ data: { error, id } }) => {
      if (error) cb(false);
      else {
        dispatch(updateProductNote({ id: +id, fields: { ...formData, id: +id } }));
        cb(true);
      }
    })
    .catch(() => cb(false));
};

export default {
  updateImage,
  getAllProducts,
  handleProductEdit,
  handleProductCreate,
  handleProductRemove,
  handleProductPostCreate,
  handleProductSupplierEdit,
  handleProductSupplierCreate,
  handleProductSupplierDelete,
};
