export default function formatCurrency(value) {
  const isNumeric = !Number.isNaN(parseFloat(value)) && Number.isFinite(value);
  if (!isNumeric) return 'N/A';
  return (value >= 0)
    ? `$${value.toFixed(2).replace(/\.00$/, '')}`
    : `-$${Math.abs(value).toFixed(2).replace(/\.00$/, '')}`;
}
