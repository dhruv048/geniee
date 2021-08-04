import {
  editReportTemplate,
  editCheckoutTemplate,
  updateReportTemplates,
  updateCheckoutTemplates,
  updateCheckoutFileName,
} from './actions';

export default {
  [updateReportTemplates]: (state, { payload }) => ({
    ...state,
    templates: {
      ...state.templates,
      reports: {
        ...payload,
      },
    },
  }),
  [editReportTemplate]: (state, { payload: { id, uploadedAt } }) => ({
    ...state,
    templates: {
      ...state.templates,
      reports: {
        ...state.templates.reports,
        [id]: {
          ...state.templates.reports[id],
          uploadedAt,
        },
      },
    },
  }),
  [updateCheckoutTemplates]: (state, { payload }) => ({
    ...state,
    templates: {
      ...state.templates,
      checkout: {
        ...payload,
      },
    },
  }),
  [editCheckoutTemplate]: (state, { payload: { id, uploadedAt } }) => ({
    ...state,
    templates: {
      ...state.templates,
      checkout: {
        ...state.templates.checkout,
        [id]: {
          ...state.templates.checkout[id],
          uploadedAt,
        },
      },
    },
  }),
  [updateCheckoutFileName]: (state, { payload: { id, fileName, uploadedAt } }) => ({
    ...state,
    templates: {
      ...state.templates,
      checkout: {
        ...state.templates.checkout,
        [id]: {
          ...state.templates.checkout[id],
          fileName,
          uploadedAt,
        },
      },
    },
  }),
};
