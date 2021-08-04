const replaceHtmlEntites = (text) => {
  const regEx = /&(nbsp|amp|quot|lt|gt);/g;
  const translate = {
    nbsp: ' ',
    amp: '&',
    quot: '"',
    lt: '<',
    gt: '>',
  };
  return (text.replace(regEx, (_match, entity) => translate[entity]));
};

export default function htmlToText(text) {
  if (!text) return '';
  return replaceHtmlEntites(text.replace(/<[^>]*>/g, ''));
}
