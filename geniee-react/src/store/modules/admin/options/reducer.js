import {
  editOption,
  removeOption,
  updateOptions,
  updatePasswordPolicy,
} from './actions';

export default {
  [editOption]: (state, { payload: { category, data } }) => {
    const currOptions = state.options || {};
    const newOptions = currOptions[category].map((c) => {
      if (parseInt(c.id, 10) === parseInt(data.id, 10)) return data;
      return c;
    });
    return {
      ...state,
      options: {
        ...currOptions,
        [category]: newOptions,
      },
    };
  },
  [removeOption]: (state, { payload: { category, data } }) => {
    const currOptions = state.options || {};
    const newOptions = currOptions[category].map((c) => {
      if (parseInt(c.id, 10) === parseInt(data.id, 10)) return { ...c, archived: true };
      return c;
    });
    return {
      ...state,
      options: {
        ...currOptions,
        [category]: newOptions,
      },
    };
  },
  [updateOptions]: (state, { payload: { category, data } }) => {
    const currOptions = state.options || {};
    const currField = currOptions[category] || [];
    return {
      ...state,
      options: {
        ...currOptions,
        [category]: [...currField, ...data],
      },
    };
  },
  [updatePasswordPolicy]: (state, { payload: { data } }) => ({
    ...state,
    passwordPolicy: {
      ...state.passwordPolicy,
      ...data,
    },
  }),
};
