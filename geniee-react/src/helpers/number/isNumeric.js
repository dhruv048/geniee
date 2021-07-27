export default function isNumeric(n) {
  return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}
