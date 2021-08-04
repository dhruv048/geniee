export default function getExpireDate(min) {
  const d = new Date();
  d.setTime(d.getTime() + (min * 60 * 1000));
  return d;
}
