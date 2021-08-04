import { dispatch } from 'store';

import {
  editProtocol,
  removeProtocol,
  updateProtocols,
  editProtocolAtomic,
} from 'store/actions';

import { api } from '../..';
import { uploadFile } from '../../admin/handlers';
import guestProtocolHandler from '../guestProtocols/handlers';

const getAllProtocols = () => {
  api.get('/api/protocol/fetchAllProtocols').then(({ data }) => {
    if (data.error) dispatch(updateProtocols({}));
    else {
      dispatch(updateProtocols({ data: data.data }));
    }
  });
};

const handleProtocolCreate = (formData, cb) => {
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
      .post('api/protocol/createProtocol', { ...formData, imageUrl })
      .then(({ data: { error, id } }) => {
        if (error) cb({ error: true });
        else {
          const {
            protocolName,
            usedFor,
            protocolUnit,
            totalPrice,
            protocolTax,
            description,
            purchasesDetails: purchases,
            protocolCost,
            isFormulaForKitchen,
            kitchenFormula,
            instructionDetails,
            packages,
            createdAt,
            createdBy,
          } = formData;

          const protocol = {
            [+id]: {
              id: +id,
              protocolName,
              usedFor,
              protocolUnit,
              totalPrice,
              protocolTax,
              description,
              imageUrl,
              purchases,
              ...protocolCost,
              isFormulaForKitchen,
              ...kitchenFormula,
              ...instructionDetails,
              packages,
              createdAt,
              createdBy,
            },
          };
          dispatch(updateProtocols({ data: protocol }));
          cb({ error: false, id });
        }
      }))
    .catch(() => cb({ error: true }));
};

const handleProtocolEdit = (formData, cb) => {
  const { currentSessionId, image } = formData;

  const promise = new Promise((resolve, reject) => {
    if (image) {
      uploadFile(image)
        .then(({ imageUrl }) => resolve({ imageUrl }))
        .catch(() => reject());
    } else resolve({ imageUrl: null });
  });

  promise
    .then(({ imageUrl }) => {
      api.post('/api/protocol/editProtocol', { ...formData, imageUrl })
        .then(({ data: { error } }) => {
          if (error) cb({ error: true, done: false });
          else {
            if (imageUrl) {
              const {
                image: imageObj,
                protocolCost,
                kitchenFormula,
                purchasesDetails,
                instructionDetails,
                ...rest } = formData;
              dispatch(editProtocol({ data: {
                ...rest,
                imageUrl,
                purchases: purchasesDetails,
                ...protocolCost,
                ...kitchenFormula,
                ...instructionDetails,
              } }));
              // Update currentSession GuestProtocols
              if (currentSessionId) guestProtocolHandler.getCurrentSessionProtocols(currentSessionId, formData.id);
            } else {
              const {
                image: imageObj,
                protocolCost,
                kitchenFormula,
                purchasesDetails,
                instructionDetails,
                ...rest } = formData;
              dispatch(editProtocol({ data: {
                ...rest,
                purchases: purchasesDetails,
                ...protocolCost,
                ...kitchenFormula,
                ...instructionDetails,
              } }));
              // Update currentSession GuestProtocols
              if (currentSessionId) guestProtocolHandler.getCurrentSessionProtocols(currentSessionId, formData.id);
            }
            cb({ error: false, done: true });
          }
        })
        .catch(() => cb({ error: true, done: false }));
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleProtocolClone = () => {};

const handleProtocolRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/protocol/removeProtocol', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeProtocol({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

const handleEditAtomicProtocol = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api
    .post('/api/protocol/editProtocolAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        if (field !== 'instructionDetails') {
          dispatch(editProtocolAtomic({ data: { id, field, value, updatedAt, updatedBy } }));
        } else {
          const { label, smallLabel, largeLabel } = value;
          dispatch(editProtocolAtomic({ data: { id, field: 'label', value: label, updatedAt, updatedBy } }));
          dispatch(editProtocolAtomic({ data: { id, field: 'smallLabel', value: smallLabel, updatedAt, updatedBy } }));
          dispatch(editProtocolAtomic({ data: { id, field: 'largeLabel', value: largeLabel, updatedAt, updatedBy } }));
        }
      }
    });
};

export default {
  getAllProtocols,
  handleProtocolEdit,
  handleProtocolClone,
  handleProtocolCreate,
  handleProtocolRemove,
  handleEditAtomicProtocol,
};
