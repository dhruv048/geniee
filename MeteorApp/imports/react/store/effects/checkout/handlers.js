import axios from 'axios';
import moment from 'moment';
import fileDownload from 'js-file-download';

import { apiUrl } from 'settings';
import { dispatch, getState } from 'store';
import { updateCheckoutTemplates, editCheckoutTemplate, updateCheckoutFileName } from 'store/actions';

import { api, token } from '..';

const handleGenerateEstimate = (formData) => {
  const fileApi = axios.create({
    baseURL: apiUrl,
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { admin: { templates: { checkout } } } = getState();
  const fileName = Object
    .values(checkout)
    .reduce((res, cur) => (cur.templateName === 'Estimate Template' ? cur.fileName : res), null)
    .replace('FName', formData.FName)
    .replace('LName', formData.LName)
    .replace('Focus', formData.Focus)
    .replace('Cycle', formData.Cycle);

  fileApi
    .post('/api/checkout/createEstimate', formData)
    .then((response) => fileDownload(response.data, fileName));
};

const handleGenerateInvoice = (formData) => {
  const fileApi = axios.create({
    baseURL: apiUrl,
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { admin: { templates: { checkout } } } = getState();
  const fileName = Object
    .values(checkout)
    .reduce((res, cur) => (cur.templateName === 'Invoice Template' ? cur.fileName : res), null)
    .replace('FName', formData.FName)
    .replace('LName', formData.LName)
    .replace('Focus', formData.Focus)
    .replace('Cycle', formData.Cycle);

  fileApi
    .post('/api/checkout/createInvoice', formData)
    .then((response) => fileDownload(response.data, fileName));
};

const handleGetTemplates = () => {
  api.get('/api/checkout/getTemplates').then(({ data }) => {
    if (data.error) dispatch(updateCheckoutTemplates({}));
    else dispatch(updateCheckoutTemplates(data.data));
  });
};

const handleDownloadTemplate = (formData) => {
  const fileApi = axios.create({
    baseURL: apiUrl,
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fileName = `${formData.name}.docx`;

  fileApi
    .post('/api/checkout/downloadTemplate', formData)
    .then((response) => {
      fileDownload(response.data, fileName);
    });
};

const handleUploadTemplate = ({ id, file, name }, cb) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  // eslint-disable-next-line no-underscore-dangle
  api.post('/api/checkout/uploadTemplate', formData, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` } })
    .then(({ data }) => {
      if (data.error) cb({ done: false });
      else {
        dispatch(editCheckoutTemplate({ id, uploadedAt: moment().format('YYYY-MM-DD') }));
        cb({ done: true });
      }
    });
};

const handleEditFileName = (formData) => {
  api.post('/api/checkout/updateFileName', {
    id: formData.id,
    fileName: formData.value,
    uploadedAt: moment(formData.updatedAt).format('YYYY-MM-DD'),
  }).then(({ data: { error } }) => {
    if (!error) {
      dispatch(updateCheckoutFileName({
        id: formData.id,
        fileName: formData.value,
        uploadedAt: moment(formData.updatedAt).format('YYYY-MM-DD'),
      }));
    }
  });
};

export default {
  handleGetTemplates,
  handleEditFileName,
  handleUploadTemplate,
  handleGenerateInvoice,
  handleGenerateEstimate,
  handleDownloadTemplate,
};
