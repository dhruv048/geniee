export default function parseStartDate(strDate) {
  // Jun 20-Jul 11 2020
  // Jan 3-24 2021
  const regEx1 = /([a-zA-Z]{3}) (\d+)-([a-zA-Z]{3}) (\d+) (\d{4})/;
  const regEx2 = /([a-zA-Z]{3}) (\d+)-(\d+) (\d{4})/;

  let startDate = null;

  if (regEx1.test(strDate)) {
    const [strMonth, strDay, , , strYear] = strDate.match(regEx1);
    startDate = new Date(`${strMonth} ${strDay}, ${strYear}`);
  }
  if (regEx2.test(strDate)) {
    const [strMonth, strDay, , strYear] = strDate.match(regEx2);
    startDate = new Date(`${strMonth} ${strDay}, ${strYear}`);
  }

  return startDate;
}
