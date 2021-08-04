import * as moment from 'moment';
import { dispatch } from 'store';

import {
  editGuestSession,
  removeGuestSession,
  updateGuestSessions,
  editGuestSessionAtomic,
  updateGuestSessionData,
  updateGuestSessionsData,
  editGuestSessionDataAtomic,
  removeGuestSessionSpending,
  updateGuestSessionsSpendings } from 'store/actions';

import { api } from '..';

const handleGetAllGuestSessionsDetails = () => new Promise((resolve, reject) => {
  api.get('/api/guest-session/fetchAllGuestSessionDetails').then(({ data }) => {
    if (data.error) reject();
    else {
      dispatch(updateGuestSessionsData({ data: data.data, section: 'details' }));
      resolve();
    }
  });
});

const handleGetAllGuestSessionsInquiryForm = () => new Promise((resolve, reject) => {
  api.get('/api/guest-session/fetchAllGuestSessionInquiryForm').then(({ data }) => {
    if (data.error) reject();
    else {
      dispatch(updateGuestSessionsData({ data: data.data, section: 'inquiryForm' }));
      resolve();
    }
  });
});

const handleGetAllGuestSessionsTravel = () => new Promise((resolve, reject) => {
  api.get('/api/guest-session/fetchAllGuestSessionTravel').then(({ data }) => {
    if (data.error) reject();
    else {
      dispatch(updateGuestSessionsData({ data: data.data, section: 'travel' }));
      resolve();
    }
  });
});

const handleGetAllGuestSessionsPreScreening = () => new Promise((resolve, reject) => {
  api.get('/api/guest-session/fetchAllGuestSessionPrescreening').then(({ data }) => {
    if (data.error) reject();
    else {
      dispatch(updateGuestSessionsData({ data: data.data, section: 'preScreening' }));
      resolve();
    }
  });
});

const handleGetAllGuestSessionsFinancing = () => new Promise((resolve, reject) => {
  api.get('/api/guest-session/fetchAllGuestSessionFinancing').then(({ data }) => {
    if (data.error) reject();
    else {
      dispatch(updateGuestSessionsData({ data: data.data, section: 'financing' }));
      resolve();
    }
  });
});

const handleGetAllGuestSessionsSpendings = () => new Promise((resolve, reject) => {
  api
    .get('/api/session-spending/fetchAllSpendings')
    .then(({ data }) => {
      if (data.error) reject();
      else {
        dispatch(updateGuestSessionsSpendings({ data: data.data }));
        resolve();
      }
    });
});

const handleGetAllGuestSessions = () => {
  api.get('/api/guest-session/fetchAllGuestSessions').then(({ data }) => {
    if (data.error) dispatch(updateGuestSessions({}));
    else {
      dispatch(updateGuestSessions({ data: data.data }));
      Promise.all([
        handleGetAllGuestSessionsDetails(),
        handleGetAllGuestSessionsInquiryForm(),
        handleGetAllGuestSessionsTravel(),
        handleGetAllGuestSessionsPreScreening(),
        handleGetAllGuestSessionsFinancing(),
        handleGetAllGuestSessionsSpendings(),
      ]);
    }
  });
};

const handleEditGuestSession = (formData, cb) => {
  api.post('/api/guest-session/editGuestSession', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      dispatch(editGuestSession({ data: formData }));
      cb(true);
    }
  });
};

const handleCreateGuestSession = (formData, cb) => {
  api.post('/api/guest-session/createGuestSession', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      const session = {
        [+data.id]: {
          id: +data.id,
          ...formData,
        },
      };
      dispatch(updateGuestSessions({ data: session }));
      cb(+data.id);
    }
  });
};

const handleEditAtomicGuestSession = (formData) => {
  const { id, section, field, value, updatedAt, updatedBy } = formData;

  if (field === 'protocolFocus') {
    const json = JSON.stringify(value);
    api
      .post('/api/guest-session/editGuestSessionAtomic', { id, section, field, value: json, updatedAt, updatedBy })
      .then(({ data: { error } }) => {
        if (!error) {
          dispatch(editGuestSessionAtomic({ data: { id, section, field, value, updatedAt, updatedBy } }));
        }
      });
  } else {
    api
      .post('/api/guest-session/editGuestSessionAtomic', { id, section, field, value, updatedAt, updatedBy })
      .then(({ data: { error } }) => {
        if (!error) {
          dispatch(editGuestSessionAtomic({ data: { id, section, field, value, updatedAt, updatedBy } }));
        }
      });
  }
};

const handleEditAtomicGuestSessionData = (formData) => {
  const { id, section, field, value, updatedAt, updatedBy } = formData;

  api
    .post('/api/guest-session/editGuestSessionDataAtomic', { id, section, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editGuestSessionDataAtomic({ data: { id, section, field, value, updatedAt, updatedBy } }));
      }
    });
};

const handleRemoveGuestSession = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/guest-session/removeGuestSession', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeGuestSession({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

const handleCreateGuestSessionDetails = (id, formData) => new Promise((resolve, reject) => {
  const filteredFields = {
    id,
    cycle: formData.cycle.value,
    programDate: formData.programDate.value,
    budget: formData.budget.value,
    deposit: formData.deposit.value,
    areaOfFocus: formData.areaOfFocus.value,
    notesForResort: formData.notesForResort.value,
    room: formData.room.value,
    reschedulingStatus: formData.reschedulingStatus.value,
  };

  api
    .post('/api/guest-session/createGuestSessionDetails', filteredFields)
    .then(({ data }) => {
      if (data.error) reject();
      else {
        dispatch(updateGuestSessionData({ id, section: 'details', fields: filteredFields }));
        resolve();
      }
    });
});

const handleEditGuestSessionDetails = (id, formData) => new Promise((resolve, reject) => {
  const filteredFields = {
    id,
    cycle: formData.cycle.value,
    programDate: formData.programDate.value,
    budget: formData.budget.value,
    deposit: formData.deposit.value,
    areaOfFocus: formData.areaOfFocus.value,
    notesForResort: formData.notesForResort.value,
    room: formData.room.value,
    reschedulingStatus: formData.reschedulingStatus.value,
  };

  api
    .post('/api/guest-session/editGuestSessionDetails', filteredFields)
    .then(({ data }) => {
      if (data.error) reject();
      else {
        dispatch(updateGuestSessionData({ id, section: 'details', fields: filteredFields }));
        resolve();
      }
    });
});

const handleCreateGuestSessionInquiryForm = (id, formData) => new Promise((resolve, reject) => {
  const filteredFields = {
    id,
    consultCurrentHealthIssues: formData.consultCurrentHealthIssues.value,
    consultProgramGoals: formData.consultProgramGoals.value,
    notesForProgramDirector: formData.notesForProgramDirector.value,
    currentHealthIssues: formData.currentHealthIssues.value,
    programGoals: formData.programGoals.value,
    anyAdditionalQuestions: formData.anyAdditionalQuestions.value,
  };

  api
    .post('/api/guest-session/createGuestSessionInquiryForm', filteredFields)
    .then(({ data }) => {
      if (data.error) reject();
      else {
        dispatch(updateGuestSessionData({ id, section: 'inquiryForm', fields: filteredFields }));
        resolve();
      }
    });
});

const handleEditGuestSessionInquiryForm = (id, formData) => new Promise((resolve, reject) => {
  const filteredFields = {
    id,
    consultCurrentHealthIssues: formData.consultCurrentHealthIssues.value,
    consultProgramGoals: formData.consultProgramGoals.value,
    notesForProgramDirector: formData.notesForProgramDirector.value,
    currentHealthIssues: formData.currentHealthIssues.value,
    programGoals: formData.programGoals.value,
    anyAdditionalQuestions: formData.anyAdditionalQuestions.value,
  };

  api
    .post('/api/guest-session/editGuestSessionInquiryForm', filteredFields)
    .then(({ data }) => {
      if (data.error) reject();
      else {
        dispatch(updateGuestSessionData({ id, section: 'inquiryForm', fields: filteredFields }));
        resolve();
      }
    });
});

const handleCreateGuestSessionTravel = (id, formData) => new Promise((resolve, reject) => {
  const filteredFields = {
    id,
    arrivalDate: formData.arrivalDate.value ? moment(formData.arrivalDate.value).format('YYYY-MM-DD') : null,
    departureDate: formData.departureDate.value ? moment(formData.departureDate.value).format('YYYY-MM-DD') : null,
    arrivalCarrier: formData.arrivalCarrier.value,
    arrivalStation: formData.arrivalStation.value,
    departureCarrier: formData.departureCarrier.value,
    departureStation: formData.departureStation.value,
    arrivalTransport: formData.arrivalTransport.value,
    departureTransport: formData.departureTransport.value,
  };

  api
    .post('/api/guest-session/createGuestSessionTravel', filteredFields)
    .then(({ data }) => {
      if (data.error) reject();
      else {
        dispatch(updateGuestSessionData({ id, section: 'travel', fields: filteredFields }));
        resolve();
      }
    });
});

const handleEditGuestSessionTravel = (id, formData) => new Promise((resolve, reject) => {
  const filteredFields = {
    id,
    arrivalDate: formData.arrivalDate.value ? moment(formData.arrivalDate.value).format('YYYY-MM-DD') : null,
    departureDate: formData.departureDate.value ? moment(formData.departureDate.value).format('YYYY-MM-DD') : null,
    arrivalCarrier: formData.arrivalCarrier.value,
    arrivalStation: formData.arrivalStation.value,
    departureCarrier: formData.departureCarrier.value,
    departureStation: formData.departureStation.value,
    arrivalTransport: formData.arrivalTransport.value,
    departureTransport: formData.departureTransport.value,
  };

  api
    .post('/api/guest-session/editGuestSessionTravel', filteredFields)
    .then(({ data }) => {
      if (data.error) reject();
      else {
        dispatch(updateGuestSessionData({ id, section: 'travel', fields: filteredFields }));
        resolve();
      }
    });
});

const handleCreateGuestSessionPreScreening = (id, formData) => new Promise((resolve, reject) => {
  const filteredFields = {
    id,
    recentSurgeries: formData.recentSurgeries.value,
    recentSurgeryDetails: formData.recentSurgeryDetails.value,
    recreationalDrugs: formData.recreationalDrugs.value,
    recreationalDrugsDescription: formData.recreationalDrugsDescription.value,
    alcohol: formData.alcohol.value,
    alcoholDetails: formData.alcoholDetails.value,
    tobacco: formData.tobacco.value,
    allergiesFoodSensitivities: formData.allergiesFoodSensitivities.value,
    allergiesFoodSensitivitiesExp: formData.allergiesFoodSensitivitiesExp.value,
    pregrant: formData.pregrant.value,
    doYouNeedAssistanceToGoUpAndDown: formData.doYouNeedAssistanceToGoUpAndDown.value,
    okWithGroup: formData.okWithGroup.value,
  };

  api
    .post('/api/guest-session/createGuestSessionPreScreening', filteredFields)
    .then(({ data }) => {
      if (data.error) reject();
      else {
        dispatch(updateGuestSessionData({ id, section: 'preScreening', fields: filteredFields }));
        resolve();
      }
    });
});

const handleEditGuestSessionPreScreening = (id, formData) => new Promise((resolve, reject) => {
  const filteredFields = {
    id,
    recentSurgeries: formData.recentSurgeries.value,
    recentSurgeryDetails: formData.recentSurgeryDetails.value,
    recreationalDrugs: formData.recreationalDrugs.value,
    recreationalDrugsDescription: formData.recreationalDrugsDescription.value,
    alcohol: formData.alcohol.value,
    alcoholDetails: formData.alcoholDetails.value,
    tobacco: formData.tobacco.value,
    allergiesFoodSensitivities: formData.allergiesFoodSensitivities.value,
    allergiesFoodSensitivitiesExp: formData.allergiesFoodSensitivitiesExp.value,
    pregrant: formData.pregrant.value,
    doYouNeedAssistanceToGoUpAndDown: formData.doYouNeedAssistanceToGoUpAndDown.value,
    okWithGroup: formData.okWithGroup.value,
  };

  api
    .post('/api/guest-session/editGuestSessionPreScreening', filteredFields)
    .then(({ data }) => {
      if (data.error) reject();
      else {
        dispatch(updateGuestSessionData({ id, section: 'preScreening', fields: filteredFields }));
        resolve();
      }
    });
});

const handleCreateGuestSessionFinancing = (id, formData) => new Promise((resolve, reject) => {
  const filteredFields = {
    id,
    amountOfLoan: formData.amountOfLoan.value,
    downPayment: formData.downPayment.value,
    amountFinanced: formData.amountFinanced.value,
    financeCharge: formData.financeCharge.value,
    totalNumberOfPayments: formData.totalNumberOfPayments.value,
    monthlyInstallments: formData.monthlyInstallments.value,
    startDateOfLoan: formData.startDateOfLoan.value,
    endDateOfLoan: formData.endDateOfLoan.value,
    annualInterestRate: formData.annualInterestRate.value,
  };

  api
    .post('/api/guest-session/createGuestSessionFinancing', filteredFields)
    .then(({ data }) => {
      if (data.error) reject();
      else {
        dispatch(updateGuestSessionData({ id, section: 'financing', fields: filteredFields }));
        resolve();
      }
    });
});

const handleEditGuestSessionFinancing = (id, formData) => new Promise((resolve, reject) => {
  const filteredFields = {
    id,
    amountOfLoan: formData.amountOfLoan.value,
    downPayment: formData.downPayment.value,
    amountFinanced: formData.amountFinanced.value,
    financeCharge: formData.financeCharge.value,
    totalNumberOfPayments: formData.totalNumberOfPayments.value,
    monthlyInstallments: formData.monthlyInstallments.value,
    startDateOfLoan: formData.startDateOfLoan.value ? moment(formData.startDateOfLoan.value).format('YYYY-MM-DD') : null,
    endDateOfLoan: formData.endDateOfLoan.value ? moment(formData.endDateOfLoan.value).format('YYYY-MM-DD') : null,
    annualInterestRate: formData.annualInterestRate.value,
  };

  api
    .post('/api/guest-session/editGuestSessionFinancing', filteredFields)
    .then(({ data }) => {
      if (data.error) reject();
      else {
        dispatch(updateGuestSessionData({ id, section: 'financing', fields: filteredFields }));
        resolve();
      }
    });
});

const handleRescheduleSession = (formData, cb) => {
  api.post('/api/guest-session/rescheduleSession', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      const session = {
        [+formData.id]: {
          ...formData,
          rescheduling: false,
        },
      };
      dispatch(updateGuestSessions({ data: session }));
      cb(true);
    }
  });
};

const handleCreateGuestSpending = (formData, cb) => {
  api
    .post('/api/session-spending/createSpending', formData)
    .then(({ data }) => {
      if (data.error) cb({ error: true, done: false });
      else {
        const spendingData = {
          [+data.id]: {
            id: data.id,
            ...formData,
          },
        };
        dispatch(updateGuestSessionsSpendings({ data: spendingData }));
        cb({ error: false, done: true });
      }
    });
};

const handleEditGuestSpending = (formData, cb) => {
  api
    .post('/api/session-spending/editSpending', formData)
    .then(({ data }) => {
      if (data.error) cb({ error: true, done: false });
      else {
        const spending = { [formData.id]: formData };
        dispatch(updateGuestSessionsSpendings({ data: spending }));
        cb({ error: false, done: true });
      }
    });
};

const handleRemoveGuestSpending = (formData, cb) => {
  api
    .post('/api/session-spending/removeSpending', formData)
    .then(({ data: { error } }) => {
      if (error) cb({ error: true });
      else {
        dispatch(removeGuestSessionSpending({ data: formData }));
        cb({ error: false });
      }
    });
};

export default {
  handleEditGuestSession,
  handleEditGuestSpending,
  handleRescheduleSession,
  handleCreateGuestSession,
  handleRemoveGuestSession,
  handleRemoveGuestSpending,
  handleGetAllGuestSessions,
  handleCreateGuestSpending,
  handleEditAtomicGuestSession,
  handleEditAtomicGuestSessionData,
  handleEditGuestSessionTravel,
  handleCreateGuestSessionTravel,
  handleEditGuestSessionDetails,
  handleCreateGuestSessionDetails,
  handleEditGuestSessionFinancing,
  handleCreateGuestSessionFinancing,
  handleEditGuestSessionInquiryForm,
  handleCreateGuestSessionInquiryForm,
  handleEditGuestSessionPreScreening,
  handleCreateGuestSessionPreScreening,
};
