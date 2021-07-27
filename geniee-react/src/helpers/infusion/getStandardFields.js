const getStandardFields = (fieldsMapping) => Object
  .values(fieldsMapping)
  .reduce((res, cur) => [...res, ...cur], [])
  .map(({ fsportal }) => fsportal)
  .concat(['createdAt', 'createdBy']);

export default getStandardFields;
