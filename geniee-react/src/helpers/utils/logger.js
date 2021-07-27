/* eslint-disable no-console */

const getTime = () => new Date().toLocaleTimeString();

const logger = {
  log: (...args) => console.log(getTime(), ...args),
  warn: (...args) => console.warn(getTime(), ...args),
  error: (...args) => console.error(getTime(), ...args),
};

export default logger;
