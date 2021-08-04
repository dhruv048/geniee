import { createActions } from 'redux-actions';

export const {
  editReportTemplate,
  editCheckoutTemplate,
  updateReportTemplates,
  updateCheckoutFileName,
  updateCheckoutTemplates,
} = createActions(
  'EDIT_REPORT_TEMPLATE',
  'EDIT_CHECKOUT_TEMPLATE',
  'UPDATE_REPORT_TEMPLATES',
  'UPDATE_CHECKOUT_FILE_NAME',
  'UPDATE_CHECKOUT_TEMPLATES',
);
