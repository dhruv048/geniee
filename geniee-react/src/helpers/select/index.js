export const prepareSelect = ({ data, field, filterCol = null }) => {
  if (!data || !data[field]) return [];

  const filteredByName = data[field].sort((a, b) => a.option - b.option);
  const filtered = filterCol
    ? filteredByName.sort((a, b) => {
      if (a[filterCol] === null) return 1;
      if (b[filterCol] === null) return -1;
      if (a[filterCol] < b[filterCol]) return -1;
      if (a[filterCol] > b[filterCol]) return 1;
      return 0;
    })
    : filteredByName;

  return filtered
    .filter((o) => !o.archived)
    .map(({ id, option: value }) => ({ id: +id, value }));
};

export const getOptionTextById = ({ data, field, id }) => {
  if (!data || !data[field] || !field) return '';
  const result = data[field].find((d) => +d.id === id);
  return result ? result.option : '';
};

export const getOptionIdByValue = ({ data, field, value }) => {
  if (!data || !data[field] || !field) return '';
  const result = data[field].find((d) => d.option === value && !d.archived);
  return result ? +result.id : null;
};

export const getUnitByQty = ({ data, id, qty }) => {
  const field = 'measurementUnits';

  if (!data || !data[field]) return '';

  const result = data[field].find((d) => +d.id === id);

  if (!result) return '';

  const singleUnit = result.option;
  const pluralUnit = result.plural || `${singleUnit}s`;

  if (!qty) return singleUnit;

  return qty === 1 ? singleUnit : pluralUnit;
};
