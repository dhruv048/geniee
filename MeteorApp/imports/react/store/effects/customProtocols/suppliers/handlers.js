import { dispatch } from 'store';

import {
  editSupplier,
  removeSupplier,
  updateSuppliers,
  updateSupplierImage,
  updateSupplierSection,
  fetchSupplierSections,
} from 'store/actions';

import { api } from '../..';
import { uploadFile } from '../../admin/handlers';

const getSeqId = (cb) => {
  api.get('/api/supplier/getSupplierNextId').then(({ data: { id } }) => {
    cb(parseInt(id, 10) + 1);
  });
};

const handleGetAllSupplierContacts = () => new Promise((resolve, reject) => {
  api.get('/api/supplier-contact/fetchAllSupplierContacts').then(({ data }) => {
    if (data.error) reject();
    else {
      dispatch(fetchSupplierSections({ data: data.data, section: 'contacts' }));
      resolve();
    }
  });
});

const handleGetAllSupplierNotes = () => new Promise((resolve, reject) => {
  api.get('/api/supplier-note/fetchAllSupplierNotes').then(({ data }) => {
    if (data.error) reject();
    else {
      dispatch(fetchSupplierSections({ data: data.data, section: 'notes' }));
      resolve();
    }
  });
});

const getAllSuppliers = () => {
  api.get('/api/supplier/fetchAllSuppliers').then(({ data }) => {
    if (data.error) dispatch(updateSuppliers({}));
    else {
      dispatch(updateSuppliers({ data: data.data }));
      Promise.all([
        handleGetAllSupplierContacts(),
        handleGetAllSupplierNotes(),
      ]);
    }
  });
};

const handleSupplierCreate = (formData, cb) => {
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
      .post('api/supplier/createSupplier', { ...formData, imageUrl })
      .then(({ data: { error, id } }) => {
        if (error) cb({ error: true });
        else {
          const supplier = {
            [+id]: {
              id: parseInt(id, 10),
              ...formData,
            },
          };
          dispatch(updateSuppliers({ data: supplier }));
          cb({ error: false, id });
        }
      }))
    .catch(() => cb({ error: true }));
};

const handleSupplierEdit = (formData, cb) => {
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
      api.post('/api/supplier/editSupplier', { ...formData, imageUrl })
        .then(({ data: { error } }) => {
          if (error) cb({ error: true, done: false });
          else {
            if (imageUrl) {
              const { image: imageObj, ...rest } = formData;
              dispatch(editSupplier({ data: { ...rest, imageUrl } }));
            } else {
              const { image: imageObj, ...rest } = formData;
              dispatch(editSupplier({ data: { ...rest } }));
            }
            cb({ error: false, done: true });
          }
        })
        .catch(() => cb({ error: true, done: false }));
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleSupplierRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/supplier/removeSupplier', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeSupplier({ data: { id, deletedAt, deletedBy } }));
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
      api.post('/api/supplier/updateSupplierImage', { id, imageUrl })
        .then(({ data: { error } }) => {
          if (error) cb(false);
          else {
            dispatch(updateSupplierImage({ data: { id, imageUrl } }));
            cb(true);
          }
        })
        .catch(() => cb(false));
    })
    .catch(() => cb(false));
};

const handleSupplierContactCreate = (formData, cb) => {
  api
    .post('api/supplier-contact/createSupplierContact', { ...formData })
    .then(({ data: { error, id } }) => {
      if (error) cb(false);
      else {
        const contact = {
          ...formData,
          id: +id,
        };
        dispatch(updateSupplierSection({ item: contact, section: 'contacts' }));
        cb(true);
      }
    })
    .catch(() => cb(false));
};

const handleSupplierContactEdit = (formData, cb) => {
  api
    .post('api/supplier-contact/editSupplierContact', { ...formData })
    .then(({ data: { error } }) => {
      if (error) cb(false);
      else {
        const contact = { ...formData };
        dispatch(updateSupplierSection({ item: contact, section: 'contacts' }));
        cb(true);
      }
    })
    .catch(() => cb(false));
};

const handleSupplierContactRemove = (formData, cb) => {
  const apiData = {
    id: formData.id,
    deletedAt: formData.deletedAt,
    deletedBy: formData.deletedBy,
  };

  api
    .post('api/supplier-contact/removeSupplierContact', apiData)
    .then(({ data: { error } }) => {
      if (error) cb(false);
      else {
        dispatch(updateSupplierSection({ item: formData, section: 'contacts' }));
        cb(true);
      }
    })
    .catch(() => cb(false));
};

const handleSupplierPostCreate = (formData, cb) => {
  api
    .post('/api/supplier-note/createSupplierNote', { ...formData })
    .then(({ data: { error, id } }) => {
      if (error) cb(false);
      else {
        const note = {
          ...formData,
          id: +id,
        };
        dispatch(updateSupplierSection({ item: note, section: 'notes' }));
        cb(true);
      }
    })
    .catch(() => cb(false));
};

export default {
  getSeqId,
  updateImage,
  getAllSuppliers,
  handleSupplierEdit,
  handleSupplierCreate,
  handleSupplierRemove,
  handleSupplierContactEdit,
  handleSupplierContactCreate,
  handleSupplierContactRemove,
  handleSupplierPostCreate,
};
