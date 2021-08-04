export default function htmlToArray(text) {
  if (!text) return [''];
  return text.match(/<p>.*?<\/p>/g);
}
