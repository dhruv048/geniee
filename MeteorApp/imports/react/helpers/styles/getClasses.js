/* eslint-disable no-return-assign, no-param-reassign */

function getClasses(...names) {
  return names.filter((v) => v).map((name) => (this[name])).join(' ');
}

export const extendStyles = (target) => (target.get = getClasses);

export default extendStyles;
