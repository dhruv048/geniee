const getCustomFields = (customFields) => Object
  .values(customFields || {})
  .map(({ fieldName }) => fieldName);

export default getCustomFields;
