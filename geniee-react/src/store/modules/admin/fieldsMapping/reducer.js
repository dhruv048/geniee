import {
  saveFieldsMapping,
  updateFieldsMapping,
  updateInfusionFields,
  removeFieldsMappingSection,
  updateFieldsMappingSection,
} from './actions';

export default {
  [updateFieldsMapping]: (state, { payload: { data } }) => ({
    ...state,
    fieldsMapping: {
      ...state.fieldsMapping,
      ...data,
    },
  }),
  [saveFieldsMapping]: (state, { payload: { entity, section, fields } }) => ({
    ...state,
    fieldsMapping: {
      ...state.fieldsMapping,
      [entity]: {
        ...state.fieldsMapping[entity],
        [section]: fields,
      },
    },
  }),
  [removeFieldsMappingSection]: (state, { payload: { entity, section } }) => {
    const updatedFieldMapping = Object.assign(state.fieldsMapping, {});
    delete updatedFieldMapping[entity][section];

    return {
      ...state,
      fieldsMapping: { ...updatedFieldMapping },
    };
  },
  [updateFieldsMappingSection]: (state, { payload: { entity, section } }) => ({
    ...state,
    fieldsMapping: {
      ...state.fieldsMapping,
      [entity]: {
        ...state.fieldsMapping[entity],
        [section]: [],
      },
    },
  }),
  [updateInfusionFields]: (state, { payload: { data } }) => ({
    ...state,
    infusionFields: {
      ...data,
    },
  }),
};
