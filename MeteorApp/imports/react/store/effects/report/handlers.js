import axios from 'axios';
import moment from 'moment';
import fileDownload from 'js-file-download';

import { apiUrl } from 'settings';
import { dispatch } from 'store';
import { updateReportTemplates, editReportTemplate } from 'store/actions';

import { api, token } from '..';

const handleGenerateGuestSummaryReport = (formData) => {
  const fileApi = axios.create({
    baseURL: apiUrl,
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fileApi
    .post('/api/report/guestSummaryReport', formData)
    .then((response) => {
      const fileName = `${formData.FName}_${formData.LName}_${formData.Cycle}_W${formData.weekNo}_Summary_Report.docx`;
      fileDownload(response.data, fileName);
    });
};

const handleGeneratePerGuestProtocolKitchenReport = (formData) => {
  const fileApi = axios.create({
    baseURL: apiUrl,
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fileApi
    .post('/api/report/perGuestProtocolKitchenReport', formData)
    .then((response) => {
      const fileName = `W${formData.weekNo}_${formData.duration}Days_Per_Guest_Protocol_Kitchen.docx`;
      fileDownload(response.data, fileName);
    });
};

const handleGeneratePerGuestProtocolSelfServeReport = (formData) => {
  const fileApi = axios.create({
    baseURL: apiUrl,
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fileApi
    .post('/api/report/perGuestProtocolSelfServeReport', formData)
    .then((response) => {
      const fileName = `W${formData.weekNo}_Per_Guest_Protocol_Self_Serve.docx`;
      fileDownload(response.data, fileName);
    });
};

const handleGenerate1045AMReport = (formData) => {
  const fileApi = axios.create({
    baseURL: apiUrl,
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fileApi
    .post('/api/report/tenFortyFiveReport', formData)
    .then((response) => {
      const fileName = `W${formData.weekNo}_10_45_AM.docx`;
      fileDownload(response.data, fileName);
    });
};

const handleGenerateMealsReport = (formData) => {
  const fileApi = axios.create({
    baseURL: apiUrl,
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fileApi
    .post('/api/report/mealsReport', formData)
    .then((response) => {
      const fileName = `W${formData.weekNo}_Meals_Report.docx`;
      fileDownload(response.data, fileName);
    });
};

const generateTotalQuantitiesReport = (formData) => {
  const fileApi = axios.create({
    baseURL: apiUrl,
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fileApi
    .post('/api/report/totalQtyReport', formData)
    .then((response) => {
      const fileName = `W${formData.weekNo}_Total_Quantities_Report.docx`;
      fileDownload(response.data, fileName);
    });
};

const generatePicknPackKitchenReport = (formData) => {
  const fileApi = axios.create({
    baseURL: apiUrl,
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fileApi
    .post('/api/report/picknpackKitchenReport', formData)
    .then((response) => {
      const fileName = `W${formData.weekNo}_Pick-n-Pack_Kitchen_Report.docx`;
      fileDownload(response.data, fileName);
    });
};

const generatePicknPackSelfServeReport = (formData) => {
  const fileApi = axios.create({
    baseURL: apiUrl,
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fileApi
    .post('/api/report/picknpackSelfServeReport', formData)
    .then((response) => {
      const fileName = `W${formData.weekNo}_Pick-n-Pack_Self-Serve_Report.docx`;
      fileDownload(response.data, fileName);
    });
};

const handleGetTemplates = () => {
  api.get('/api/report/getTemplates').then(({ data }) => {
    if (data.error) dispatch(updateReportTemplates({}));
    else dispatch(updateReportTemplates(data.data));
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

  const fileName = formData.days === 'Any'
    ? `${formData.name}.docx`
    : `${formData.name}_${formData.days}_Days.docx`;

  fileApi
    .post('/api/report/downloadTemplate', formData)
    .then((response) => {
      fileDownload(response.data, fileName);
    });
};

const handleUploadTemplate = ({ id, file, name, days }, cb) => {
  const formData = new FormData();
  formData.append('id', id);
  formData.append('file', file);
  formData.append('name', name);
  formData.append('days', days);
  // eslint-disable-next-line no-underscore-dangle
  api.post('/api/report/uploadTemplate', formData, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` } })
    .then(({ data }) => {
      if (data.error) cb({ done: false });
      else {
        dispatch(editReportTemplate({ id, uploadedAt: moment().format('YYYY-MM-DD') }));
        cb({ done: true });
      }
    });
};

export default {
  handleGetTemplates,
  handleUploadTemplate,
  handleDownloadTemplate,
  handleGenerateMealsReport,
  handleGenerate1045AMReport,
  generateTotalQuantitiesReport,
  generatePicknPackKitchenReport,
  generatePicknPackSelfServeReport,
  handleGenerateGuestSummaryReport,
  handleGeneratePerGuestProtocolKitchenReport,
  handleGeneratePerGuestProtocolSelfServeReport,
};
