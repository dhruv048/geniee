import { createActions } from 'redux-actions';

export const {
  saveFieldsMapping,
  updateFieldsMapping,
  updateInfusionFields,
  updateFieldsMappingSection,
  removeFieldsMappingSection } = createActions(
  'SAVE_FIELDS_MAPPING',
  'UPDATE_FIELDS_MAPPING',
  'UPDATE_INFUSION_FIELDS',
  'UPDATE_FIELDS_MAPPING_SECTION',
  'REMOVE_FIELDS_MAPPING_SECTION',
);
