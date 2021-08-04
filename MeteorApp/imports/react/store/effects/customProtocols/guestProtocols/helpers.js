export const getOptionValueById = ({ data, field, id }) => {
  if (!data || !data[field] || !id) return '';
  const result = data[field].find((d) => +d.id === +id);
  return result ? result.option : '';
};

export const updateDescription = ({ template, data, options }) => {
  let result = template || '';
  if (template.indexOf('[FFU]') !== -1 && data.ffu) {
    result = result.replace('[FFU]', data.ffu);
  }
  if (template.indexOf('[QTY]') !== -1 && data.qty) {
    result = result.replace('[QTY]', data.qty);
  }
  if (template.indexOf('[DAYS]') !== -1 && data.days) {
    result = result.replace('[DAYS]', data.days);
  }
  if (template.indexOf('[UNIT]') !== -1 && data.protocolUnit) {
    const protocolUnit = getOptionValueById({ data: options, field: 'measurementUnits', id: data.protocolUnit });
    result = result.replace('[UNIT]', protocolUnit);
  }
  if (template.indexOf('[TIME]') !== -1 && data.servingTime) {
    const servingTime = getOptionValueById({ data: options, field: 'servingTimes', id: data.servingTime });
    result = result.replace('[TIME]', servingTime);
  }
  return result;
};

export const updateLabel = ({ template, data, options }) => {
  let result = template || '';
  if (template.indexOf('[QTY]') !== -1 && data.qty) {
    result = result.replace('[QTY]', data.qty);
  }
  if (template.indexOf('[TIME]') !== -1 && data.servingTime) {
    const servingTime = getOptionValueById({ data: options, field: 'servingTimes', id: data.servingTime });
    result = result.replace('[TIME]', servingTime);
  }
  return result;
};
