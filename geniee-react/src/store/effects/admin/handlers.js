/* eslint-disable no-console */
import { dispatch } from 'store';
import imageCompression from 'browser-image-compression';

import { apiUrl } from 'settings';
import {
  editOption,
  removeOption,
  updateOptions,
  updateFieldTypes,
  updateLoggedUser,
  updateFieldsMapping,
  updateColumnSettings,
  updatePasswordPolicy,
  updateOptionSources,
  saveFieldsMapping,
  updateCustomFields,
  removeFieldsMappingSection,
} from 'store/actions';

import { api } from '..';
import Meteor from 'meteor-react-js';

export const uploadFile = (file) => new Promise((resolve, reject) => {
  imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 150,
    useWebWorker: true,
  })
    .then((compressedFile) => {
      const formData = new FormData();
      formData.append('file', compressedFile);
      api.post('/api/admin/uploadImage', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(({ data }) => {
          if (data.error) reject();
          else resolve({ imageUrl: `${apiUrl}/static/${data.file}` });
        });
    })
    .catch(() => reject());
});

const getLoggedUser = () => {
  // api.post('/api/user/fetchUser', { id }).then(({ data }) => {
  //   if (data.error) dispatch(updateLoggedUser({}));
    // else 
    
    dispatch(updateLoggedUser({ data: Meteor.user() }));
  // });
};

const getPasswordPolicy = (cb) => {
  api.get('/api/admin/getPasswordPolicy').then(({ data }) => {
    if (data.error) {
      dispatch(updatePasswordPolicy({}));
      cb(false);
    } else {
      dispatch(updatePasswordPolicy({ data: data.data }));
      cb(true);
    }
  });
};

const savePasswordPolicy = (formData, cb) => {
  api.post('/api/admin/updatePasswordPolicy', {
    password_expire: formData.passwordExpiry.value,
    uppercase_chars: formData.upperCase.value,
    lowercase_chars: formData.lowerCase.value,
    numeric_chars: formData.numbers.value,
    special_chars: formData.special.value,
    password_length: formData.passwordLength.value,
  }).then(({ data }) => {
    if (data.error) {
      cb({ error: true, done: false });
    } else {
      dispatch(updatePasswordPolicy({ data: {
        password_expire: formData.passwordExpiry.value,
        uppercase_chars: formData.upperCase.value,
        lowercase_chars: formData.lowerCase.value,
        numeric_chars: formData.numbers.value,
        special_chars: formData.special.value,
        password_length: formData.passwordLength.value,
      } }));
      cb({ error: false, done: true });
    }
  });
};

const fetchOptionsTitles = () => {
  api.get('/api/options/getOptionsTitles').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsTitles endpoint');
    else dispatch(updateOptions({ category: 'titles', data }));
  });
};

const fetchOptionsCountries = () => {
  api.get('/api/options/getOptionsCountries').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsCountries endpoint');
    else dispatch(updateOptions({ category: 'countries', data }));
  });
};

const fetchOptionsGenders = () => {
  api.get('/api/options/getOptionsGenders').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsGenders endpoint');
    else dispatch(updateOptions({ category: 'genders', data }));
  });
};

const fetchOptionsMaritalStatuses = () => {
  api.get('/api/options/getOptionsMaritalStatuses').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsMaritalStatuses endpoint');
    else dispatch(updateOptions({ category: 'maritalStatuses', data }));
  });
};

const fetchOptionsTimezones = () => {
  api.get('/api/options/getOptionsTimezones').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsTimezones endpoint');
    else dispatch(updateOptions({ category: 'timezones', data }));
  });
};

const fetchOptionsSessionsStatuses = () => {
  api.get('/api/options/getOptionsSessionStatuses').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsSessionStatuses endpoint');
    else dispatch(updateOptions({ category: 'sessionStatuses', data }));
  });
};

const fetchOptionsSessionsTypes = () => {
  api.get('/api/options/getOptionsSessionTypes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsSessionTypes endpoint');
    else dispatch(updateOptions({ category: 'sessionTypes', data }));
  });
};

const fetchOptionsSessionsLocations = () => {
  api.get('/api/options/getOptionsSessionLocations').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsSessionLocations endpoint');
    else dispatch(updateOptions({ category: 'sessionLocations', data }));
  });
};

const fetchOptionsSessionsYears = () => {
  api.get('/api/options/getOptionsSessionYears').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsSessionYears endpoint');
    else dispatch(updateOptions({ category: 'sessionYears', data }));
  });
};

const fetchOptionsCompanyTypes = () => {
  api.get('/api/options/getOptionsCompanyTypes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsCompanyTypes endpoint');
    else dispatch(updateOptions({ category: 'companyTypes', data }));
  });
};

const fetchOptionsJobTitles = () => {
  api.get('/api/options/getOptionsJobTitles').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsJobTitles endpoint');
    else dispatch(updateOptions({ category: 'jobTitles', data }));
  });
};

const fetchOptionsJobDivisions = () => {
  api.get('/api/options/getOptionsJobDivisions').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsJobDivisions endpoint');
    else dispatch(updateOptions({ category: 'jobDivisions', data }));
  });
};

const fetchOptionsJobLocations = () => {
  api.get('/api/options/getOptionsJobLocations').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsJobLocations endpoint');
    else dispatch(updateOptions({ category: 'jobLocations', data }));
  });
};

const fetchOptionsJobReportsTo = () => {
  api.get('/api/options/getOptionsJobReportsTo').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsJobReportsTo endpoint');
    else dispatch(updateOptions({ category: 'jobReportsTo', data }));
  });
};

const fetchOptionsJobDepartments = () => {
  api.get('/api/options/getOptionsJobDepartments').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsJobDepartments endpoint');
    else dispatch(updateOptions({ category: 'jobDepartments', data }));
  });
};

const fetchOptionsEmploymentStatuses = () => {
  api.get('/api/options/getOptionsEmploymentStatuses').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsEmploymentStatuses endpoint');
    else dispatch(updateOptions({ category: 'employmentStatuses', data }));
  });
};

const fetchOptionsContactRelations = () => {
  api.get('/api/options/getOptionsContactRelations').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsContactRelations endpoint');
    else dispatch(updateOptions({ category: 'contactRelations', data }));
  });
};

const fetchOptionsProgramCycles = () => {
  api.get('/api/options/getOptionsProgramCycles').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsProgramCycles endpoint');
    else dispatch(updateOptions({ category: 'programCycles', data }));
  });
};

const fetchOptionsAreaOfFocus = () => {
  api.get('/api/options/getOptionsAreaOfFocus').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsAreaOfFocus endpoint');
    else dispatch(updateOptions({ category: 'areasOfFocus', data }));
  });
};

const fetchOptionsRooms = () => {
  api.get('/api/options/getOptionsRooms').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsRooms endpoint');
    else dispatch(updateOptions({ category: 'rooms', data }));
  });
};

const fetchOptionsCarriers = () => {
  api.get('/api/options/getOptionsCarriers').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsCarriers endpoint');
    else dispatch(updateOptions({ category: 'travelCarriers', data }));
  });
};

const fetchOptionsTransports = () => {
  api.get('/api/options/getOptionsTransports').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsTransports endpoint');
    else dispatch(updateOptions({ category: 'travelTransports', data }));
  });
};

const fetchOptionsStations = () => {
  api.get('/api/options/getOptionsStations').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsStations endpoint');
    else dispatch(updateOptions({ category: 'travelStations', data }));
  });
};

const fetchOptionsReschedulingStatuses = () => {
  api.get('/api/options/getOptionsReschedulingStatuses').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsReschedulingStatuses endpoint');
    else dispatch(updateOptions({ category: 'reschedulingStatuses', data }));
  });
};

const fetchOptionsPaymentTypes = () => {
  api.get('/api/options/getOptionsPaymentTypes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsPaymentTypes endpoint');
    else dispatch(updateOptions({ category: 'paymentTypes', data }));
  });
};

const fetchOptionsIngredientType = () => {
  api.get('/api/options/getOptionsIngredientTypes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsIngredientTypes endpoint');
    else dispatch(updateOptions({ category: 'ingredientTypes', data }));
  });
};

const fetchOptionsIngredientCategories = () => {
  api.get('/api/options/getOptionsIngredientCategories').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsIngredientCategories endpoint');
    else dispatch(updateOptions({ category: 'ingredientCategories', data }));
  });
};

const fetchOptionsInventoryType = () => {
  api.get('/api/options/getOptionsInventoryTypes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsInventoryTypes endpoint');
    else dispatch(updateOptions({ category: 'inventoryTypes', data }));
  });
};

const fetchOptionsInventoryCategories = () => {
  api.get('/api/options/getOptionsInventoryCategories').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsInventoryCategories endpoint');
    else dispatch(updateOptions({ category: 'inventoryCategories', data }));
  });
};

const fetchOptionsMeasurementTypes = () => {
  api.get('/api/options/getOptionsMeasurementTypes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsMeasurementTypes endpoint');
    else dispatch(updateOptions({ category: 'measurementTypes', data }));
  });
};

const fetchOptionsMeasurementUnits = () => {
  api.get('/api/options/getOptionsMeasurementUnits').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsMeasurementUnits endpoint');
    else dispatch(updateOptions({ category: 'measurementUnits', data }));
  });
};

const fetchOptionsProductType = () => {
  api.get('/api/options/getOptionsProductTypes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsProductTypes endpoint');
    else dispatch(updateOptions({ category: 'productTypes', data }));
  });
};

const fetchOptionsProductCategories = () => {
  api.get('/api/options/getOptionsProductCategories').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsProductCategories endpoint');
    else dispatch(updateOptions({ category: 'productCategories', data }));
  });
};

const fetchOptionsTaxes = () => {
  api.get('/api/options/getOptionsTaxes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsTaxes endpoint');
    else dispatch(updateOptions({ category: 'taxes', data }));
  });
};

const fetchOptionsPurchaseTypes = () => {
  api.get('/api/options/getOptionsPurchaseTypes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsPurchaseTypes endpoint');
    else dispatch(updateOptions({ category: 'purchaseTypes', data }));
  });
};

const fetchOptionsPurchasePackages = () => {
  api.get('/api/options/getOptionsPurchasePackages').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsPurchasePackages endpoint');
    else dispatch(updateOptions({ category: 'purchasePackages', data }));
  });
};

const fetchOptionsPurchasePer = () => {
  api.get('/api/options/getOptionsPurchasePer').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsPurchasePer endpoint');
    else dispatch(updateOptions({ category: 'purchasePer', data }));
  });
};

const fetchOptionsUsedFor = () => {
  api.get('/api/options/getOptionsUsedFor').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsUsedFor endpoint');
    else dispatch(updateOptions({ category: 'usedFor', data }));
  });
};

const fetchOptionsContainers = () => {
  api.get('/api/options/getOptionsContainers').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsContainers endpoint');
    else dispatch(updateOptions({ category: 'containers', data }));
  });
};

const fetchOptionsServeIn = () => {
  api.get('/api/options/getOptionsServeIn').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsServeIn endpoint');
    else dispatch(updateOptions({ category: 'serveIn', data }));
  });
};

const fetchOptionsWeeks = () => {
  api.get('/api/options/getOptionsWeeks').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsWeeks endpoint');
    else dispatch(updateOptions({ category: 'weeks', data }));
  });
};

const fetchOptionsServingTypes = () => {
  api.get('/api/options/getOptionsServingTypes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsServingTypes endpoint');
    else dispatch(updateOptions({ category: 'servingTypes', data }));
  });
};

const fetchOptionsServingTimes = () => {
  api.get('/api/options/getOptionsServingTimes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsServingTimes endpoint');
    else dispatch(updateOptions({ category: 'servingTimes', data }));
  });
};

const fetchOptionsTipsCategories = () => {
  api.get('/api/options/getOptionsTipsCategories').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsTipsCategories endpoint');
    else dispatch(updateOptions({ category: 'tipsCategories', data }));
  });
};

const fetchOptionsServiceCreditDurations = () => {
  api.get('/api/options/getOptionsServiceCreditDurations').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsServiceCreditDurations endpoint');
    else dispatch(updateOptions({ category: 'serviceCreditDurations', data }));
  });
};

const fetchOptionsGeneralTypes = () => {
  api.get('/api/options/getOptionsGeneralTypes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsGeneralTypes endpoint');
    else dispatch(updateOptions({ category: 'generalTypes', data }));
  });
};

const fetchOptionsGeneralCategories = () => {
  api.get('/api/options/getOptionsGeneralCategories').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsGeneralCategories endpoint');
    else dispatch(updateOptions({ category: 'generalCategories', data }));
  });
};

const fetchOptionsProvidedBy = () => {
  api.get('/api/options/getOptionsProvidedBy').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsProvidedBy endpoint');
    else dispatch(updateOptions({ category: 'providedBy', data }));
  });
};

const fetchOptionsServiceTypes = () => {
  api.get('/api/options/getOptionsServiceTypes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsServiceTypes endpoint');
    else dispatch(updateOptions({ category: 'serviceTypes', data }));
  });
};

const fetchOptionsServiceCategories = () => {
  api.get('/api/options/getOptionsServiceCategories').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsServiceCategories endpoint');
    else dispatch(updateOptions({ category: 'serviceCategories', data }));
  });
};

const fetchOptionsEventTypes = () => {
  api.get('/api/options/getOptionsEventTypes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsEventTypes endpoint');
    else dispatch(updateOptions({ category: 'eventTypes', data }));
  });
};

const fetchOptionsEventCategories = () => {
  api.get('/api/options/getOptionsEventCategories').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsEventCategories endpoint');
    else dispatch(updateOptions({ category: 'eventCategories', data }));
  });
};

const fetchOptionsServiceRooms = () => {
  api.get('/api/options/getOptionsServiceRooms').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsServiceRooms endpoint');
    else dispatch(updateOptions({ category: 'serviceRooms', data }));
  });
};

const fetchOptionsSpendingCategories = () => {
  api.get('/api/options/getOptionsSpendingCategories').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsServiceRooms endpoint');
    else dispatch(updateOptions({ category: 'spendingCategories', data }));
  });
};

const fetchOptionsProtocolTypes = () => {
  api.get('/api/options/getOptionsProtocolTypes').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsProtocolTypes endpoint');
    else dispatch(updateOptions({ category: 'protocolTypes', data }));
  });
};

const fetchOptionsEventStatuses = () => {
  api.get('/api/options/getOptionsEventStatuses').then(({ data: { error, data } }) => {
    if (error) console.log('Error fetching /api/getOptionsEventStatuses endpoint');
    else dispatch(updateOptions({ category: 'eventStatuses', data }));
  });
};

const addOption = ({ category, tableName, option, plural = null }, cb) => {
  api.post('/api/options/addOption', { tableName, option, plural }).then(({ data: { error, data } }) => {
    if (error) console.log('Error inserting new option');
    else dispatch(updateOptions({ category, data: [data] }));
    cb();
  });
};

const addOptionCycle = ({ category, tableName, option }) => new Promise((resolve, reject) => {
  api.post('/api/options/addOption', { tableName, option }).then(({ data: { error, data } }) => {
    if (error) reject();
    else {
      dispatch(updateOptions({ category, data: [data] }));
      resolve(data.id);
    }
  });
});

const handleEditOption = ({ id, category, tableName, option, plural }, cb) => {
  api.post('/api/options/editOption', { id, tableName, option, plural }).then(({ data: { error } }) => {
    if (error) console.log('Error editing option');
    else {
      dispatch(editOption({ category, data: { id, option, plural } }));
    }
    cb();
  });
};

const handleEditFutureOption = ({ id, category, tableName, option, plural }, cb) => {
  api.post('/api/options/editFutureOption', { id, tableName, option, plural }).then(({ data: { error, data } }) => {
    if (error) console.log('Error editing option');
    else {
      dispatch(removeOption({ category, data: { id } }));
      dispatch(updateOptions({ category, data: [data] }));
    }
    cb(error);
  });
};

const handleRemoveOption = ({ category, tableName, id }, cb) => {
  api.post('/api/options/deleteOption', { tableName, id }).then(({ data: { error } }) => {
    if (error) console.log('Error editing option');
    else dispatch(removeOption({ category, data: { id } }));
    cb(error);
  });
};

const getColumnSettings = (userId) => {
  api.post('/api/admin/fetchColumnSettings', { userId }).then(({ data: { data } }) => {
    if (data.length) dispatch(updateColumnSettings({ data }));
  });
};

const saveColumnSettings = ({ userId, tableName, columns }, cb) => {
  api.post('/api/admin/saveColumnSettings', { userId, tableName, columns }).then(({ data: { error } }) => {
    if (error) cb(false);
    else {
      dispatch(updateColumnSettings({ data: [{ table_name: tableName, cols: columns }] }));
      cb(true);
    }
  });
};

const fetchFieldsMapping = () => {
  api.get('/api/admin/fetchFieldMapping').then(({ data }) => {
    if (data.error) dispatch(updateFieldsMapping({}));
    else dispatch(updateFieldsMapping({ data: data.data }));
  });
};

const handleSaveFieldsMapping = (formData, cb) => {
  api.post('/api/admin/saveFieldMapping', { ...formData }).then(({ error }) => {
    if (error) cb(false);
    else {
      const { entity, section, fields } = formData;
      dispatch(saveFieldsMapping({ entity, section, fields }));
      cb(true);
    }
  });
};

const fetchFieldTypes = () => {
  api.get('/api/admin/fetchFieldTypes').then(({ data }) => {
    if (data.error) dispatch(updateFieldTypes({}));
    else dispatch(updateFieldTypes({ data: data.data }));
  });
};

const fetchOptionSources = () => {
  api.get('/api/options/getOptions').then(({ data }) => {
    if (data.error) dispatch(updateOptionSources({}));
    else dispatch(updateOptionSources({ data: data.data }));
  });
};

const fetchCustomFields = () => api
  .get('/api/admin/fetchCustomFields')
  .then(({ data }) => {
    if (!data.error) dispatch(updateCustomFields(data.data));
  });

const handleCreateCustomField = (formData, cb) => {
  api
    .post('/api/admin/createCustomField', { ...formData })
    .then(({ data }) => {
      if (data.err) cb(false);
      else {
        const { entity, fieldName, fieldType, fieldSource } = formData;
        const fieldData = {
          [entity]: {
            [data.id]: { id: +data.id, fieldName, fieldType, fieldSource },
          },
        };
        dispatch(updateCustomFields(fieldData));
        cb(true);
      }
    });
};

const removeFieldMappingSection = ({ entity, section }, cb) => {
  api
    .post('/api/admin/removeFieldMappingSection', { entity, section })
    .then(({ data }) => {
      if (data.err) cb(false);
      else {
        dispatch(removeFieldsMappingSection({ entity, section }));
        cb(true);
      }
    });
};

const getAllAdminData = (userId) => {
  fetchFieldTypes();
  fetchOptionsTaxes();
  fetchCustomFields();
  fetchOptionSources();
  fetchOptionsRooms();
  fetchOptionsWeeks();
  fetchOptionsTitles();
  fetchOptionsGenders();
  fetchOptionsUsedFor();
  fetchOptionsServeIn();
  fetchOptionsCarriers();
  fetchOptionsStations();
  fetchOptionsCountries();
  fetchOptionsJobTitles();
  fetchOptionsTimezones();
  fetchOptionsContainers();
  fetchOptionsProvidedBy();
  fetchOptionsTransports();
  fetchOptionsEventTypes();
  fetchOptionsProductType();
  fetchOptionsAreaOfFocus();
  fetchOptionsPurchasePer();
  fetchOptionsServiceRooms();
  fetchOptionsGeneralTypes();
  fetchOptionsServiceTypes();
  fetchOptionsPaymentTypes();
  fetchOptionsCompanyTypes();
  fetchOptionsJobDivisions();
  fetchOptionsJobLocations();
  fetchOptionsJobReportsTo();
  fetchOptionsServingTypes();
  fetchOptionsServingTimes();
  fetchOptionsProtocolTypes();
  fetchOptionsSessionsTypes();
  fetchOptionsSessionsYears();
  fetchOptionsInventoryType();
  fetchOptionsEventStatuses();
  fetchOptionsProgramCycles();
  fetchOptionsPurchaseTypes();
  fetchOptionsTipsCategories();
  fetchOptionsJobDepartments();
  fetchOptionsIngredientType();
  fetchOptionsEventCategories();
  fetchOptionsMaritalStatuses();
  fetchOptionsSessionsStatuses();
  fetchOptionsMeasurementTypes();
  fetchOptionsMeasurementUnits();
  fetchOptionsPurchasePackages();
  fetchOptionsContactRelations();
  fetchOptionsServiceCategories();
  fetchOptionsProductCategories();
  fetchOptionsGeneralCategories();
  fetchOptionsSessionsLocations();
  fetchOptionsEmploymentStatuses();
  fetchOptionsSpendingCategories();
  fetchOptionsInventoryCategories();
  fetchOptionsReschedulingStatuses();
  fetchOptionsIngredientCategories();
  fetchOptionsServiceCreditDurations();
  getLoggedUser(userId);
  getPasswordPolicy(() => {});
  getColumnSettings(userId);
  fetchFieldsMapping();
};

export default {
  uploadFile,
  getLoggedUser,
  getPasswordPolicy,
  savePasswordPolicy,
  getAllAdminData,
  handleSaveFieldsMapping,
  addOption,
  addOptionCycle,
  handleEditOption,
  handleEditFutureOption,
  handleRemoveOption,
  getColumnSettings,
  saveColumnSettings,
  handleCreateCustomField,
  removeFieldMappingSection,
};
