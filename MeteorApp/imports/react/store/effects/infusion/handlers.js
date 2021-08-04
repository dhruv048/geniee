/* eslint-disable no-nested-ternary */
import axios from 'axios';
import { getState, dispatch } from 'store';

import { apiUrl, infusionApiUrl } from 'settings';
import {
  updateGuests,
  updateGuestSessions,
  updateInfusionFields,
  updateInfusionGuests,
  updateInfusionSessions,
  updateGuestSessionsData,
  updateFieldsMappingSection,
} from 'store/actions';

import { getCustomFields, getStandardFields } from 'helpers';

import { api } from '..';

const handleGetInfusionSessions = (cb) => axios({
  method: 'get',
  url: `${infusionApiUrl}?action=getSessions`,
}).then(({ data }) => {
  if (typeof data !== 'object') {
    cb(false);
    return;
  }
  const sessions = data.reduce((res, name, id) => ({
    ...res,
    [id]: { id, name },
  }), {});
  dispatch(updateInfusionSessions({ data: sessions }));
  cb(true);
}).catch(() => cb(false));

const handleGetGuestFields = () => axios({
  method: 'get',
  url: `${infusionApiUrl}?action=getContactFields`,
}).then(({ err, data }) => {
  if (!err) dispatch(updateInfusionFields({ ...data }));
});

const handleGetSessionClients = (sessionName) => axios({
  method: 'get',
  url: `${infusionApiUrl}?action=getSessionClients&session=${sessionName}`,
}).then(({ err, data }) => {
  if (err) dispatch(updateInfusionGuests([]));
  if (data) dispatch(updateInfusionGuests({ data }));
});

const handleCreateSection = ({ entity, section }) => api
  .post(`${apiUrl}/api/admin/createFieldMappingSection`, { entity, section })
  .then(({ err }) => {
    if (!err) dispatch(updateFieldsMappingSection({ entity, section }));
  });

const handleImportGuests = ({ formData, sessionId, importState, createdAt, createdBy }, cb) => {
  const { admin: { fieldsMapping, customFields } } = getState();
  let status = {};

  const guestCustomFields = getCustomFields(customFields.guest);
  const guestStandardFields = getStandardFields(fieldsMapping.guest);
  const guestSessionCustomFields = getCustomFields(customFields.guest_session);

  const guests = Object
    .values(formData)
    .filter((value) => (
      importState[value.infusionId].isImport
      && importState[value.infusionId].guest
    ))
    .map((guest) => ({ ...guest, createdAt, createdBy }));

  api.post(`${apiUrl}/api/guest/importInfusionGuests`, {
    guests,
    importState,
    guestCustomFields,
    guestStandardFields,
  }).then(({ data: { done, data = [] } }) => {
    if (!done) cb(false);
    else {
      const importedGuests = data.reduce((res, { id, infusionId }) => {
        const guest = guests.find((g) => +g.infusionId === +infusionId);
        const guestFields = [...guestStandardFields, ...guestCustomFields]
          .reduce((fields, field) => {
            if (!guest[field] || !importState[infusionId][field]) return fields;
            return {
              ...fields,
              [field]: guest[field] || null,
            };
          }, {});

        if (id === undefined) return { ...res };

        return {
          ...res,
          [+id]: {
            id: +id,
            ...res[+id],
            ...guestFields,
          },
        };
      }, {});

      status = data.reduce((res, { id, infusionId }) => {
        const guest = guests.find((g) => +g.infusionId === +infusionId);
        if (id === undefined) return { ...res };
        return {
          ...res,
          [infusionId]: {
            infusionId,
            firstName: guest.firstName,
            lastName: guest.lastName,
            fsGuestId: `G${id}`,
            isNew: Object
              .values(importedGuests)
              .reduce((result, cur) => (cur.infusionGuestId === infusionId ? false : result), true),
          },
        };
      }, {});

      // Update store
      dispatch(updateGuests({ data: importedGuests }));

      const getFSPortalGuestId = (infusionId) => Object
        .values(importedGuests)
        .reduce((res, cur) => (cur.infusionId === infusionId ? cur.id : res), null);

      const getFSField = (infusionId, field) => Object
        .values(formData)
        .reduce((res, cur) => (cur.infusionId === infusionId
          ? (cur[field] !== undefined ? cur[field] : null)
          : res), null);

      // Prepare guest sessions
      const guestSessions = Object
        .values(formData)
        .filter((value) => (
          importState[value.infusionId].isImport
          && importState[value.infusionId].guest_session))
        .map((guestSession) => ({
          ...guestSession,
          fsPortalId: getFSPortalGuestId(guestSession.infusionId),
          createdAt,
          createdBy,
        }));

      // Import guest sessions
      api
        .post('/api/guest-session/importGuestSessions', {
          sessionId,
          importState,
          guestSessions,
          guestSessionCustomFields,
        })
        .then(({ error, data: { data: sessions = [] } }) => {
          if (error) {
            cb(false);
            return;
          }
          // Prepare sessions
          const importedSessions = sessions.reduce((res, { id, infusionId }) => ({
            ...res,
            [+id]: {
              id: +id,
              ...res[+id],
              guestId: getFSPortalGuestId(infusionId),
              sessionId,
              rescheduling: false,
              createdAt,
              createdBy,
              customFields: guestSessionCustomFields,
            },
          }), {});

          status = sessions.reduce((res, { id, infusionId }) => ({
            ...res,
            [infusionId]: {
              ...res[infusionId],
              fsSessionId: `GS${id}`,
            },
          }), status);

          // Update store
          dispatch(updateGuestSessions({ data: importedSessions }));
          // Prepare session details
          const sessionDetails = sessions.reduce((res, { id, infusionId }) => ({
            ...res,
            [+id]: {
              id: +id,
              cycle: getFSField(infusionId, 'cycle'),
              programDate: getFSField(infusionId, 'programDate'),
              budget: getFSField(infusionId, 'budget'),
              deposit: getFSField(infusionId, 'deposit'),
              areaOfFocus: getFSField(infusionId, 'areaOfFocus'),
              notesForResort: getFSField(infusionId, 'notesForResort'),
              room: getFSField(infusionId, 'room'),
              reschedulingStatus: getFSField(infusionId, 'reschedulingStatus'),
            },
          }), {});
          dispatch(updateGuestSessionsData({ data: sessionDetails, section: 'details' }));
          // Prepare session inquiry form
          const sessionInquiryForm = sessions.reduce((res, { id, infusionId }) => ({
            ...res,
            [+id]: {
              id: +id,
              consultCurrentHealthIssues: getFSField(infusionId, 'consultCurrentHealthIssues'),
              currentHealthIssues: getFSField(infusionId, 'currentHealthIssues'),
              consultProgramGoals: getFSField(infusionId, 'consultProgramGoals'),
              programGoals: getFSField(infusionId, 'programGoals'),
              notesForProgramDirector: getFSField(infusionId, 'notesForProgramDirector'),
              anyAdditionalQuestions: getFSField(infusionId, 'anyAdditionalQuestions'),
            },
          }), {});
          dispatch(updateGuestSessionsData({ data: sessionInquiryForm, section: 'inquiryForm' }));
          // Prepare session travel
          const sessionTravel = sessions.reduce((res, { id, infusionId }) => ({
            ...res,
            [+id]: {
              id: +id,
              arrivalDate: getFSField(infusionId, 'arrivalDate'),
              departureDate: getFSField(infusionId, 'departureDate'),
              arrivalCarrier: getFSField(infusionId, 'arrivalCarrier'),
              departureCarrier: getFSField(infusionId, 'departureCarrier'),
              arrivalStation: getFSField(infusionId, 'arrivalStation'),
              departureStation: getFSField(infusionId, 'departureStation'),
              arrivalTransport: getFSField(infusionId, 'arrivalTransport'),
              departureTransport: getFSField(infusionId, 'departureTransport'),
            },
          }), {});
          dispatch(updateGuestSessionsData({ data: sessionTravel, section: 'travel' }));
          // Prepare session prescreening
          const sessionPrescreening = sessions.reduce((res, { id, infusionId }) => ({
            ...res,
            [+id]: {
              id: +id,
              recentSurgeries: getFSField(infusionId, 'recentSurgeries'),
              recentSurgeryDetails: getFSField(infusionId, 'recentSurgeryDetails'),
              recreationalDrugs: getFSField(infusionId, 'recreationalDrugs'),
              recreationalDrugsDescription: getFSField(infusionId, 'recreationalDrugsDescription'),
              alcohol: getFSField(infusionId, 'alcohol'),
              alcoholDetails: getFSField(infusionId, 'alcoholDetails'),
              tobacco: getFSField(infusionId, 'tobacco'),
              allergiesFoodSensitivities: getFSField(infusionId, 'allergiesFoodSensitivities'),
              allergiesFoodSensitivitiesExp: getFSField(infusionId, 'allergiesFoodSensitivitiesExp'),
              pregrant: getFSField(infusionId, 'pregrant'),
              doYouNeedAssistanceToGoUpAndDown: getFSField(infusionId, 'doYouNeedAssistanceToGoUpAndDown'),
              okWithGroup: getFSField(infusionId, 'okWithGroup'),
            },
          }), {});
          dispatch(updateGuestSessionsData({ data: sessionPrescreening, section: 'preScreening' }));
          // Prepare session financing
          const sessionFinancing = sessions.reduce((res, { id, infusionId }) => ({
            ...res,
            [+id]: {
              id: +id,
              amountOfLoan: getFSField(infusionId, 'amountOfLoan'),
              downPayment: getFSField(infusionId, 'downPayment'),
              amountFinanced: getFSField(infusionId, 'amountFinanced'),
              financeCharge: getFSField(infusionId, 'financeCharge'),
              totalNumberOfPayments: getFSField(infusionId, 'totalNumberOfPayments'),
              monthlyInstallments: getFSField(infusionId, 'monthlyInstallments'),
              startDateOfLoan: getFSField(infusionId, 'startDateOfLoan'),
              endDateOfLoan: getFSField(infusionId, 'endDateOfLoan'),
              annualInterestRate: getFSField(infusionId, 'annualInterestRate'),
            },
          }), {});
          dispatch(updateGuestSessionsData({ data: sessionFinancing, section: 'financing' }));
          cb(true, status);
        });
    }
  });
};

export default {
  handleGetInfusionSessions,
  handleCreateSection,
  handleGetGuestFields,
  handleGetSessionClients,
  handleImportGuests,
};
