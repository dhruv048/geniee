/* eslint-disable no-loop-func */
/* eslint-disable camelcase */
import moment from 'moment';

import { htmlToText, htmlToArray, getUnitByQty, logger } from 'helpers';
import reportHandler from 'store/effects/report/handlers';

export const prepareSessionSelect = ({ data, field, filterCol = null }) => {
  if (!Object.values(data).length) return [];
  const arr = Object.values(data).filter((item) => !item.archived);
  const filtered = filterCol
    ? arr.sort((a, b) => {
      if (a[filterCol] === null) return 1;
      if (b[filterCol] === null) return -1;
      if (a[filterCol] < b[filterCol]) return -1;
      if (a[filterCol] > b[filterCol]) return 1;
      return 0;
    })
    : arr;
  return filtered
    .filter((item) => !item.archived)
    .map(({ id, [field]: value }) => ({ id: +id, value }));
};

export const getSessionValueById = ({ data, id }) => {
  if (!data || !id) return '';
  const result = data.find((d) => +d.id === +id);
  return result ? result.name : '';
};

const getGuestFullNameById = ({ guests, guestId }) => {
  if (!guests || !guestId) return '';
  const result = Object.values(guests).find((g) => +g.id === +guestId);
  return result ? `${result.firstName} ${result.lastName}` : '';
};

export const getOptionValueById = ({ data, field, id }) => {
  if (!data || !data[field] || !id) return '';
  const result = data[field].find((d) => +d.id === +id);
  return result ? result.option : '';
};

export const getOptionIdByValue = ({ data, field, value }) => {
  if (!data || !data[field] || !value) return null;
  const result = data[field].find((d) => d.option === value && !d.archived);
  return result ? +result.id : null;
};

const getCustomCycleWeeks = (details, session) => {
  const { startDate, endDate } = session;
  const dtStartDate = new Date(startDate);
  const dtEndDate = new Date(endDate);
  const restDatesRange = details.programDate.split(/[-,]/g);
  const restYear = restDatesRange[2];
  const restRangeStart = restDatesRange[0] + restYear;
  const restRangeEnd = (restDatesRange[1].replace(/[^A-Za-z]/g, '').length)
    ? restDatesRange[1] + restYear
    : restRangeStart.slice(0, 4) + restDatesRange[1] + restYear;
  const restStartDate = new Date(restRangeStart);
  const restEndDate = new Date(restRangeEnd);
  const milisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  const startSessionWeek = ((restStartDate - dtStartDate) > 0)
    ? Math.ceil((restStartDate - dtStartDate) / milisecondsPerWeek)
    : 1;
  const weeksToSessionEnd = ((dtEndDate - restEndDate) > 0)
    ? Math.floor((dtEndDate - restEndDate) / milisecondsPerWeek)
    : 0;
  const weeksInSession = 3;
  const arr = [];

  for (let i = startSessionWeek; i <= (weeksInSession - weeksToSessionEnd); i += 1) {
    arr.push(i);
  }

  return arr;
};

const getWeeks = (details, session, options) => {
  if (!options || !options.programCycles || !details) return [];

  const programCycle = options.programCycles.filter((program) => +program.id === details.cycle);
  switch (programCycle[0].option) {
    case '21 Day':
      return [1, 2, 3];
    case '14 Day II':
      return [2, 3];
    case '14 Day I':
      return [1, 2];
    case '7 Day III':
      return [3];
    case '7 Day II':
      return [2];
    case '7 Day I':
      return [1];
    case 'Custom':
      return getCustomCycleWeeks(details, session);
    default:
      return [];
  }
};

export const getSessionGuests = ({ guests, guestSessions, sessionId, sessions, options, customProtocolRules }) => {
  if (!guestSessions || !sessionId || !sessions || !customProtocolRules) return [];

  const currentSession = Object.values(sessions).find((s) => +s.id === +sessionId);
  const currentGuestsSession = Object
    .values(guestSessions)
    .filter((session) => session.sessionId === +sessionId && !session.reschedule && !session.archived)
    .map((session) => {
      const guestFullName = getGuestFullNameById({ guests, guestId: session.guestId });
      const cycleName = session.details
        ? getOptionValueById({ data: options, field: 'programCycles', id: session.details.cycle })
        : null;
      const value = `${guestFullName}, ${cycleName}`;
      const sessionWeeks = getWeeks(session.details, currentSession, options);

      const summary = sessionWeeks.map((weekNo, weekIndex) => {
        const weekRule = Object
          .values(customProtocolRules.protocolStartRules)
          .find((w) => w.week === weekIndex + 1);
        const startDateIdx = weekRule ? weekRule.startsDay : 0;
        const protocolStartDate = moment(currentSession.startDate)
          .add(startDateIdx + (weekNo - 1) * 7 - 1, 'days')
          .format('YYYY-MM-DD');
        const protocolEndDate = moment(protocolStartDate).add(weekRule ? weekRule.duration - 1 : 0, 'days')
          .format('YYYY-MM-DD');
        return {
          weekIndex: weekIndex + 1,
          weekNo,
          duration: weekRule ? weekRule.duration : 0,
          protocolStartDate,
          protocolEndDate,
        };
      });

      return ({
        id: session.guestId,
        value,
        cycle: session.details ? session.details.cycle : null,
        areaOfFocus: session.details ? session.details.areaOfFocus : null,
        selected: false,
        sessionWeeks,
        healthFocus: session.healthFocus || '',
        protocolFocus: session.protocolFocus || '',
        summary,
      });
    });

  return currentGuestsSession;
};

export const getSessionGuest = (props) => {
  const { guests, guestSessions, guestId, sessionId, sessions, options, customProtocolRules } = props;

  if (!guestSessions || !sessionId || !sessions || !customProtocolRules) return [];

  const currentSession = Object.values(sessions).find((s) => +s.id === +sessionId);
  const currentGuestsSession = Object
    .values(guestSessions)
    .filter((session) => session.sessionId === +sessionId
      && session.guestId === +guestId
      && !session.reschedule
      && !session.archived)
    .map((session) => {
      const guestFullName = getGuestFullNameById({ guests, guestId: session.guestId });
      const cycleName = session.details
        ? getOptionValueById({ data: options, field: 'programCycles', id: session.details.cycle })
        : null;
      const value = `${guestFullName}, ${cycleName}`;
      const sessionWeeks = getWeeks(session.details, currentSession, options);

      const summary = sessionWeeks.map((weekNo, weekIndex) => {
        const weekRule = Object
          .values(customProtocolRules.protocolStartRules)
          .find((w) => w.week === weekIndex + 1);
        const startDateIdx = weekRule ? weekRule.startsDay : 0;
        const protocolStartDate = moment(currentSession.startDate)
          .add(startDateIdx + (weekNo - 1) * 7 - 1, 'days')
          .format('YYYY-MM-DD');
        const protocolEndDate = moment(protocolStartDate).add(weekRule ? weekRule.duration - 1 : 0, 'days')
          .format('YYYY-MM-DD');
        return {
          weekIndex: weekIndex + 1,
          weekNo,
          duration: weekRule ? weekRule.duration : 0,
          protocolStartDate,
          protocolEndDate,
        };
      });

      return ({
        id: session.guestId,
        value,
        cycle: session.details ? session.details.cycle : null,
        areaOfFocus: session.details ? session.details.areaOfFocus : null,
        selected: false,
        sessionWeeks,
        healthFocus: session.healthFocus || '',
        protocolFocus: session.protocolFocus || '',
        summary,
      });
    });

  return currentGuestsSession;
};

export const getInitials = (text) => (text
  ? text
    .replace(/[^a-zA-Z- ]/g, '')
    .match(/\b\w/g)
    .join('')
  : '');

const getFriDate = (weekData) => (weekData.duration === 3
  ? moment(weekData.protocolStartDate).add(1, 'day').format('YYYY-MM-DD')
  : moment(weekData.protocolStartDate).add(3, 'day').format('YYYY-MM-DD'));

const getSunDate = (weekData) => moment(weekData.protocolEndDate).add(1, 'day').format('YYYY-MM-DD');

export const getFriSunDate = (weekData) => {
  const friDate = getFriDate(weekData);
  const sunDate = getSunDate(weekData);
  return moment(friDate).format('MM') === moment(sunDate).format('MM')
    ? `${moment(friDate).format('MMM DD')}-${moment(sunDate).format('DD, YYYY')}`
    : `${moment(friDate).format('MMM DD')}-${moment(sunDate).format('MMM DD, YYYY')}`;
};

export const getThuSatDate = (weekData) => {
  const startDate = weekData.protocolStartDate;
  const endDate = weekData.protocolEndDate;
  return moment(startDate).format('MM') === moment(endDate).format('MM')
    ? `${moment(startDate).format('MMM DD')}-${moment(endDate).format('DD, YYYY')}`
    : `${moment(startDate).format('MMM DD')}-${moment(endDate).format('MMM DD, YYYY')}`;
};

export const getTueSatDate = (weekData) => {
  const startDate = weekData.protocolStartDate;
  const endDate = weekData.protocolEndDate;
  return moment(startDate).format('MM') === moment(endDate).format('MM')
    ? `${moment(startDate).format('MMM DD')}-${moment(endDate).format('DD, YYYY')}`
    : `${moment(startDate).format('MMM DD')}-${moment(endDate).format('MMM DD, YYYY')}`;
};

const sortByTime = (protocols) => protocols.sort((a, b) => {
  const aTime = a.time;
  const bTime = b.time;
  if (/ (AM|PM)/.test(aTime) && / (AM|PM)/.test(bTime)) {
    return new Date(`1970/01/01 ${aTime}`) - new Date(`1970/01/01 ${bTime}`);
  }
  if (/ (AM|PM)/.test(aTime) && !/ (AM|PM)/.test(bTime)) return -1;
  if (!/ (AM|PM)/.test(aTime) && / (AM|PM)/.test(bTime)) return 1;
  return 1;
});

export const getFriSunProtocols = (weekProtocols) => Object.entries(weekProtocols)
  .filter(([time]) => ['8:00 AM', '8:30 AM', '9:00 AM'].includes(time))
  .map(([time, { isSelfServe, protocols }]) => ({ time, isSelfServe, data: protocols.join(' | ') }));

export const getThuSatProtocols = (weekProtocols, exclude = true) => (exclude
  ? Object.entries(weekProtocols)
    .filter(([time]) => !['8:00 AM', '8:30 AM', '9:00 AM'].includes(time))
    .map(([time, { isSelfServe, protocols }]) => ({ time, isSelfServe, data: protocols.join(' | ') }))
  : Object.entries(weekProtocols)
    .map(([time, { isSelfServe, protocols }]) => ({ time, isSelfServe, data: protocols.join(' | ') })));

export const getTueSatProtocols = (weekProtocols, exclude = true) => (exclude
  ? Object.entries(weekProtocols)
    .filter(([time]) => !['8:00 AM', '8:30 AM', '9:00 AM'].includes(time))
    .map(([time, { isSelfServe, protocols }]) => ({ time, isSelfServe, data: protocols.join(' | ') }))
  : Object.entries(weekProtocols)
    .map(([time, { isSelfServe, protocols }]) => ({ time, isSelfServe, data: protocols.join(' | ') })));

const getWeekProtocolFocus = (focus, weekNo) => {
  if (!focus || !focus[weekNo]) return '';
  return focus[weekNo];
};

export const generateGuestSummaryReport = ({
  guests,
  options,
  formData,
  protocols,
  guestsData,
  currentSession,
  guestProtocols }) => {
  for (let guestIndex = 0; guestIndex < guestsData.length; guestIndex++) {
    const guestSessionId = guestsData[guestIndex];
    const guest = formData.guests.find((g) => g.id === guestSessionId);
    const { guestId } = guest;
    const filterWeeks = Object.values(formData.weeks).filter((w) => w.checked).map((w) => w.id);
    const weeks = guest.sessionWeeks.filter((weekNo) => filterWeeks.includes(weekNo));
    for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
      const weekNo = weeks[weekIndex];
      const weekData = guest.summary.find((week) => week.weekNo === weekNo);
      const weekProtocols = Object.values(guestProtocols)
        .filter((gp) => (
          gp.guestId === guestId
          && gp.sessionId === currentSession
          && gp.week === weekNo
          && !gp.archived))
        .reduce((res, cur) => {
          const servingTime = getOptionValueById({ data: options, field: 'servingTimes', id: cur.servingTime });
          const servingType = getOptionValueById({ data: options, field: 'servingTypes', id: cur.servingType });
          const protocolQty = protocols[cur.protocolId].isFormulaForKitchen ? +cur.protocolFFU : +cur.qty;
          const unit = getUnitByQty({ data: options, id: cur.protocolUnit, qty: protocolQty });
          const protocolInfo = `${protocolQty} ${unit} ${protocols[cur.protocolId].protocolName}`;
          const curTime = res[servingTime] || {};
          const curTimeProtocols = curTime.protocols || [];
          return {
            ...res,
            [servingTime]: {
              isSelfServe: servingType === 'Self-Serve',
              protocols: [...curTimeProtocols, protocolInfo],
            },
          };
        }, {});

      reportHandler.handleGenerateGuestSummaryReport({
        end: moment(weekData.protocolEndDate).format('ddd'),
        start: moment(weekData.protocolStartDate).format('ddd'),
        week: weekData.weekIndex,
        FName: guests[guestId].firstName,
        LName: guests[guestId].lastName,
        Cycle: getOptionValueById({ data: options, field: 'programCycles', id: guest.cycle }),
        Focus: getInitials(getOptionValueById({ data: options, field: 'areasOfFocus', id: guest.areaOfFocus })),
        weekNo,
        duration: weekData.duration,
        FriSunDate: getFriSunDate(weekData),
        ThuSatDate: getThuSatDate(weekData),
        TueSatDate: getTueSatDate(weekData),
        frisunprotocols: sortByTime(getFriSunProtocols(weekProtocols)),
        thusatprotocols: sortByTime(getThuSatProtocols(weekProtocols)),
        tuesatprotocols: sortByTime(getTueSatProtocols(weekProtocols)),
        HealthFocus: guest.healthFocus,
        ProtocolFocus: getWeekProtocolFocus(guest.protocolFocus, weekNo),
      });
    }
  }
};

export const generateProtocolPerGuestReport = ({
  guests,
  options,
  formData,
  protocols,
  guestsData,
  currentSession,
  guestProtocols,
}) => {
  let reportData = {};
  for (let guestIndex = 0; guestIndex < guestsData.length; guestIndex++) {
    const guestSessionId = guestsData[guestIndex];
    const guest = formData.guests.find((g) => g.id === guestSessionId);
    const { guestId } = guest;
    const filterWeeks = Object.values(formData.weeks).filter((w) => w.checked).map((w) => w.id);
    const weeks = guest.sessionWeeks.filter((weekNo) => filterWeeks.includes(weekNo));
    for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
      const weekNo = weeks[weekIndex];
      const weekData = guest.summary.find((week) => week.weekNo === weekNo);
      const servingTypeId = getOptionIdByValue({ data: options, field: 'servingTypes', value: 'Kitchen Serve' });
      reportData = Object.values(guestProtocols)
        .filter((gp) => (
          gp.guestId === guestId
          && gp.sessionId === currentSession
          && gp.week === weekNo
          && gp.servingType === servingTypeId
          && !gp.archived))
        .reduce((res, cur) => {
          const servingTime = getOptionValueById({ data: options, field: 'servingTimes', id: cur.servingTime });
          const protocolQty = protocols[cur.protocolId].isFormulaForKitchen ? +cur.protocolFFU : +cur.qty;
          const unit = getUnitByQty({ data: options, id: cur.protocolUnit, qty: protocolQty });
          const protocolInfo = `${protocolQty} ${unit} ${protocols[cur.protocolId].protocolName}`;
          const startDay = moment(weekData.protocolStartDate).format('ddd');
          const endDay = moment(weekData.protocolEndDate).format('ddd');
          const protocolDays = `${startDay}-${endDay}`;
          const protocolDaysTo = `${startDay} to ${endDay}`;
          const protocolDates = moment(weekData.protocolStartDate).format('MM') === moment(weekData.protocolEndDate).format('MM')
            ? `${moment(weekData.protocolStartDate).format('MMM DD')}-${moment(weekData.protocolEndDate).format('DD, YYYY')}`
            : `${moment(weekData.protocolStartDate).format('MMM DD')}-${moment(weekData.protocolEndDate).format('MMM DD, YYYY')}`;
          const exceptionStartDay = getFriDate(weekData);
          const exceptionEndDay = getSunDate(weekData);
          const exceptionDays = `${moment(exceptionStartDay).format('ddd')}-${moment(exceptionEndDay).format('ddd')}`;
          const exceptionDates = moment(exceptionStartDay).format('MM') === moment(exceptionEndDay).format('MM')
            ? `${moment(exceptionStartDay).format('MMM DD')}-${moment(exceptionEndDay).format('DD, YYYY')}`
            : `${moment(exceptionStartDay).format('MMM DD')}-${moment(exceptionEndDay).format('MMM DD, YYYY')}`;

          const curWeeks = res.weeks || {};
          const curWeek = curWeeks[weekNo] || {};
          const curWeekDurations = curWeek.durations || {};
          const curWeekDuration = curWeekDurations[weekData.duration] || {};
          const curWeekGuests = curWeekDuration.guests || {};
          const curWeekGuest = curWeekGuests[guestId] || {};
          const curWeekGuestServingTimes = curWeekGuest.servingTimes || {};
          const curWeekGuestServingTime = curWeekGuestServingTimes[servingTime] || {};
          const curWeekGuestServingTimeProtocols = curWeekGuestServingTime.protocols || [];

          return {
            ...res,
            weeks: {
              ...curWeeks,
              [weekNo]: {
                ...curWeek,
                weekNo,
                durations: {
                  ...curWeekDurations,
                  [weekData.duration]: {
                    ...curWeekDuration,
                    duration: weekData.duration,
                    guests: {
                      ...curWeekGuests,
                      [guestId]: {
                        ...curWeekGuest,
                        week: weekData.weekIndex,
                        weekNo,
                        duration: weekData.duration,
                        protocolDays,
                        protocolDaysTo,
                        protocolDates,
                        exceptionDays,
                        exceptionDates,
                        FName: guests[guestId].firstName,
                        LName: guests[guestId].lastName,
                        Cycle: getOptionValueById({ data: options, field: 'programCycles', id: guest.cycle }),
                        Focus: getInitials(getOptionValueById({ data: options, field: 'areasOfFocus', id: guest.areaOfFocus })),
                        servingTimes: {
                          ...curWeekGuestServingTimes,
                          [servingTime]: {
                            protocols: [...curWeekGuestServingTimeProtocols, protocolInfo],
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          };
        }, reportData);
    }
  }

  if (!reportData.weeks) {
    logger.log('No data');
    return;
  }

  Object.keys(reportData.weeks).forEach((weekNo) => {
    const weekData = reportData.weeks[weekNo];
    Object.values(weekData.durations).forEach((durationData) => {
      const data = {
        weekNo,
        duration: durationData.duration,
        guests: Object.values(durationData.guests)
          .map(({ servingTimes, ...guest }) => ({
            ...guest,
            protocols: sortByTime(getThuSatProtocols(servingTimes)),
            exceptionProtocols: getFriSunProtocols(servingTimes),
          }))
          .sort((a, b) => {
            if (a.FName < b.FName) return -1;
            if (a.FName > b.FName) return 1;
            return 0;
          }),
      };

      reportHandler.handleGeneratePerGuestProtocolKitchenReport(data);
    });
  });
};

export const generateSelfServeReport = ({
  guests,
  options,
  formData,
  protocols,
  guestsData,
  currentSession,
  guestProtocols,
}) => {
  let reportData = {};
  for (let guestIndex = 0; guestIndex < guestsData.length; guestIndex++) {
    const guestSessionId = guestsData[guestIndex];
    const guest = formData.guests.find((g) => g.id === guestSessionId);
    const { guestId } = guest;
    const filterWeeks = Object.values(formData.weeks).filter((w) => w.checked).map((w) => w.id);
    const weeks = guest.sessionWeeks.filter((weekNo) => filterWeeks.includes(weekNo));
    for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
      const weekNo = weeks[weekIndex];
      const weekData = guest.summary.find((week) => week.weekNo === weekNo);
      const servingTypeId = getOptionIdByValue({ data: options, field: 'servingTypes', value: 'Self-Serve' });
      reportData = Object.values(guestProtocols)
        .filter((gp) => (
          gp.guestId === guestId
          && gp.sessionId === currentSession
          && gp.week === weekNo
          && gp.servingType === servingTypeId
          && !gp.archived))
        .reduce((res, cur) => {
          const servingTime = getOptionValueById({ data: options, field: 'servingTimes', id: cur.servingTime });
          const unit = getUnitByQty({ data: options, id: cur.protocolUnit, qty: +cur.qty });
          const protocolInfo = `${cur.qty} ${unit} ${protocols[cur.protocolId].protocolName}`;
          const startDay = moment(weekData.protocolStartDate).format('ddd');
          const endDay = moment(weekData.protocolEndDate).format('ddd');
          const protocolDays = `${startDay}-${endDay}`;
          const protocolDates = moment(weekData.protocolStartDate).format('MM') === moment(weekData.protocolEndDate).format('MM')
            ? `${moment(weekData.protocolStartDate).format('MMM DD')}-${moment(weekData.protocolEndDate).format('DD, YYYY')}`
            : `${moment(weekData.protocolStartDate).format('MMM DD')}-${moment(weekData.protocolEndDate).format('MMM DD, YYYY')}`;

          const curWeeks = res.weeks || {};
          const curWeek = curWeeks[weekNo] || {};
          const curWeekDurations = curWeek.durations || {};
          const curWeekDuration = curWeekDurations[weekData.duration] || {};
          const curWeekGuests = curWeekDuration.guests || {};
          const curWeekGuest = curWeekGuests[guestId] || {};
          const curWeekServingTimes = curWeekGuest.servingTimes || {};
          const curWeekServingTime = curWeekServingTimes[servingTime] || {};
          const curTimeProtocols = curWeekServingTime.protocols || [];

          return {
            ...res,
            weeks: {
              ...curWeeks,
              [weekNo]: {
                ...curWeek,
                weekNo: weekData.weekIndex,
                durations: {
                  ...curWeekDurations,
                  [weekData.duration]: {
                    ...curWeekDuration,
                    duration: weekData.duration,
                    protocolDays,
                    guests: {
                      ...curWeekGuests,
                      [guestId]: {
                        ...curWeekGuest,
                        FName: guests[guestId].firstName,
                        LName: guests[guestId].lastName,
                        Cycle: getOptionValueById({ data: options, field: 'programCycles', id: guest.cycle }),
                        Focus: getInitials(getOptionValueById({ data: options, field: 'areasOfFocus', id: guest.areaOfFocus })),
                        protocolDays: protocolDays.replace('-', ' to '),
                        protocolDates,
                        // HealthFocus: htmlToText(guest.healthFocus),
                        // ProtocolFocus: htmlToText(getWeekProtocolFocus(guest.protocolFocus, weekNo)),
                        servingTimes: {
                          ...curWeekServingTimes,
                          [servingTime]: {
                            ...curWeekServingTime,
                            servingTime,
                            protocols: [...curTimeProtocols, protocolInfo],
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          };
        }, reportData);
    }
  }

  if (!reportData.weeks) {
    logger.log('No data');
    return;
  }

  for (let weekIndex = 0; weekIndex < Object.keys(reportData.weeks).length; weekIndex++) {
    const weekNo = Object.keys(reportData.weeks)[weekIndex];
    const weekData = reportData.weeks[weekNo];

    Object.values(weekData.durations).forEach((data) => {
      const { duration, protocolDays, guests: guestData } = data;

      const updatedGuests = Object
        .values(guestData)
        .map((guest) => ({
          ...guest,
          servingTimes: Object
            .values(guest.servingTimes)
            .map((st) => ({
              servingTime: st.servingTime,
              data: st.protocols.join(' | '),
            }))
            .sort((a, b) => {
              const aTime = a.servingTime;
              const bTime = b.servingTime;
              if (/ (AM|PM)/.test(aTime) && / (AM|PM)/.test(bTime)) {
                return new Date(`1970/01/01 ${aTime}`) - new Date(`1970/01/01 ${bTime}`);
              }
              if (/ (AM|PM)/.test(aTime) && !/ (AM|PM)/.test(bTime)) return -1;
              if (!/ (AM|PM)/.test(aTime) && / (AM|PM)/.test(bTime)) return 1;
              return 1;
            }),
        }));

      reportHandler.handleGeneratePerGuestProtocolSelfServeReport({
        weekNo,
        guestNo: updatedGuests.length,
        guests: updatedGuests,
        duration,
        protocolDays,
      });
    });
  }
};

export const generate1045Report = ({
  guests,
  options,
  formData,
  protocols,
  guestsData,
  currentSession,
  guestProtocols,
}) => {
  let reportData = {};
  for (let guestIndex = 0; guestIndex < guestsData.length; guestIndex++) {
    const guestSessionId = guestsData[guestIndex];
    const guest = formData.guests.find((g) => g.id === guestSessionId);
    const { guestId } = guest;
    const filterWeeks = Object.values(formData.weeks).filter((w) => w.checked).map((w) => w.id);
    const weeks = guest.sessionWeeks.filter((weekNo) => filterWeeks.includes(weekNo));
    for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
      const weekNo = weeks[weekIndex];
      const days = formData.weeks[`W${weekNo}`].day3Checked ? 3 : 5;
      const servingTimeId = getOptionIdByValue({ data: options, field: 'servingTimes', value: '10:45 AM' });
      reportData = Object.values(guestProtocols)
        .filter((gp) => (
          gp.guestId === guestId
          && gp.sessionId === currentSession
          && gp.week === weekNo
          && gp.servingTime === servingTimeId
          && !gp.archived))
        .reduce((res, cur) => {
          const {
            qty,
            protocolId,
            protocolFFU,
            protocolName,
            protocolUnit,
            protocolType,
            howToPrepare,
            additionalInstruction: ffuInstruction,
            additionalInstructionForKitchen: kichenInstruction } = cur;
          const unit = getUnitByQty({ data: options, id: protocolUnit, qty: +qty });
          const type = getOptionValueById({ data: options, field: 'protocolTypes', id: protocolType });
          const { isFormulaForKitchen } = protocols[protocolId];

          const protocolInfo = isFormulaForKitchen
            ? `${protocols[protocolId].protocolName} (${parseInt(protocolFFU * qty, 10)}) ${unit} - per Guest`
            : `${qty} ${unit} ${protocols[protocolId].protocolName}`;

          const additionalInstruction = isFormulaForKitchen
            ? ffuInstruction
            : kichenInstruction;

          const curWeeks = res.weeks || {};
          const curWeek = curWeeks[weekNo] || {};
          const curWeekProtocols = curWeek.protocols || {};
          const curWeekProtocol = curWeekProtocols[protocolName] || {};
          const curProtocolQuantities = curWeekProtocol.quantities || {};
          const curProtocolQty = curProtocolQuantities[qty] || {};
          const curProtocolQtyGuests = curProtocolQty.guests || [];
          return {
            ...res,
            weeks: {
              ...curWeeks,
              [weekNo]: {
                ...curWeek,
                days,
                protocols: {
                  ...curWeekProtocols,
                  [protocolName]: {
                    ...curWeekProtocol,
                    protocolName,
                    protocolType: type,
                    quantities: {
                      ...curProtocolQuantities,
                      [qty]: {
                        ...curProtocolQty,
                        guests: [...curProtocolQtyGuests, guests[guestId].firstName],
                        guestNo: curProtocolQtyGuests.length + 1,
                        protocolInfo: htmlToText(protocolInfo),
                        howToPrepare: htmlToArray(howToPrepare).map((par) => htmlToText(par)),
                        additionalInstruction: htmlToArray(additionalInstruction).map((par) => htmlToText(par)),
                        additionalInstructionForKitchen: htmlToArray(kichenInstruction).map((par) => htmlToText(par)),
                      },
                    },
                    isFormulaForKitchen,
                  },
                },
              },
            },
          };
        }, reportData);
    }
  }

  if (!reportData.weeks) {
    logger.log('No data');
    return;
  }

  for (let weekIndex = 0; weekIndex < Object.keys(reportData.weeks).length; weekIndex++) {
    const weekNo = Object.keys(reportData.weeks)[weekIndex];
    const weekData = reportData.weeks[weekNo];
    const weekProtocols = weekData.protocols || {};
    const data = {
      days: weekData.days,
      weekNo,
      singleIngredientProtocols: [],
      multiIngredientsProtocols: [],
      isSingleIngredientProtocols: false,
      isMultiIngredientsProtocols: false,
    };
    Object.keys(weekProtocols).forEach((protocolName) => {
      const { isFormulaForKitchen, protocolType } = weekProtocols[protocolName];
      if (isFormulaForKitchen) {
        data.isMultiIngredientsProtocols = true;
        const typeIdx = data.multiIngredientsProtocols.findIndex((d) => d.protocolType === protocolType);
        if (typeIdx !== -1) {
          data.multiIngredientsProtocols[typeIdx].protocols.push({
            quantity: Object
              .entries(weekProtocols[protocolName].quantities)
              .map(([qty, protocol]) => ({ ...protocol, qty, guestNames: protocol.guests.join(', ') })),
            protocolName,
          });
        } else {
          data.multiIngredientsProtocols.push({
            protocolType,
            protocols: [{
              quantity: Object
                .entries(weekProtocols[protocolName].quantities)
                .map(([qty, protocol]) => ({ ...protocol, qty, guestNames: protocol.guests.join(', ') })),
              protocolName,
            }],
          });
        }
      } else {
        data.isSingleIngredientProtocols = true;
        const typeIdx = data.singleIngredientProtocols.findIndex((d) => d.protocolType === protocolType);
        if (typeIdx !== -1) {
          data.singleIngredientProtocols[typeIdx].protocols.push({
            quantity: Object
              .entries(weekProtocols[protocolName].quantities)
              .map(([qty, protocol]) => ({ ...protocol, qty, guestNames: protocol.guests.join(', ') })),
            protocolName,
          });
        } else {
          data.singleIngredientProtocols.push({
            protocolType,
            protocols: [{
              quantity: Object
                .entries(weekProtocols[protocolName].quantities)
                .map(([qty, protocol]) => ({ ...protocol, qty, guestNames: protocol.guests.join(', ') })),
              protocolName,
            }],
          });
        }
      }
    });

    reportHandler.handleGenerate1045AMReport(data);
  }
};

export const generateMealReport = ({
  guests,
  options,
  formData,
  protocols,
  guestsData,
  currentSession,
  guestProtocols,
}) => {
  let reportData = {};
  for (let guestIndex = 0; guestIndex < guestsData.length; guestIndex++) {
    const guestSessionId = guestsData[guestIndex];
    const guest = formData.guests.find((g) => g.id === guestSessionId);
    const { guestId } = guest;
    const filterWeeks = Object.values(formData.weeks).filter((w) => w.checked).map((w) => w.id);
    const weeks = guest.sessionWeeks.filter((weekNo) => filterWeeks.includes(weekNo));
    for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
      const weekNo = weeks[weekIndex];
      const weekData = guest.summary.find((week) => week.weekNo === weekNo);
      const protocolDays = `${moment(weekData.protocolStartDate).format('ddd')} - ${moment(weekData.protocolEndDate).format('ddd')}`;
      const protocolDates = moment(weekData.protocolStartDate).format('MMM') === moment(weekData.protocolEndDate).format('MMM')
        ? `(${protocolDays}) | ${moment(weekData.protocolStartDate).format('MMM DD')}-${moment(weekData.protocolEndDate).format('DD, YYYY')}`
        : `(${protocolDays}) | ${moment(weekData.protocolStartDate).format('MMM DD')}-${moment(weekData.protocolEndDate).format('MMM DD, YYYY')}`;
      const servingTimeId_8AM = getOptionIdByValue({ data: options, field: 'servingTimes', value: '8:00 AM' });
      const servingTimeId_9AM = getOptionIdByValue({ data: options, field: 'servingTimes', value: '9:00 AM' });
      const servingTimeId_1PM = getOptionIdByValue({ data: options, field: 'servingTimes', value: '1:00 PM' });
      const servingTimeId_5PM = getOptionIdByValue({ data: options, field: 'servingTimes', value: '5:00 PM' });
      reportData = Object.values(guestProtocols)
        .filter((gp) => (
          gp.guestId === guestId
          && gp.sessionId === currentSession
          && gp.week === weekNo
          && (gp.servingTime === servingTimeId_8AM
            || gp.servingTime === servingTimeId_9AM
            || gp.servingTime === servingTimeId_1PM
            || gp.servingTime === servingTimeId_5PM)
          && !gp.archived))
        .reduce((res, cur) => {
          const {
            qty,
            protocolId,
            protocolFFU,
            servingTime,
            protocolName,
            protocolUnit,
            howToPrepare,
            additionalInstruction: ffuInstruction,
            additionalInstructionForKitchen: kichenInstruction } = cur;
          const isFFU = protocols[protocolId].isFormulaForKitchen;
          const protocolQty = isFFU ? +protocolFFU : +qty;
          const unit = getUnitByQty({ data: options, id: protocolUnit, qty: protocolQty });

          const protocolTitle = isFFU
            ? `${protocols[protocolId].protocolName} (${parseInt(protocolFFU * qty, 10)}) ${unit} - per Guest`
            : '';
          const protocolInfo = isFFU
            ? htmlToArray(howToPrepare).map((par) => htmlToText(par))
            : [`${qty} ${unit} ${protocols[protocolId].protocolName}`];
          const additionalInstructionForKitchen = isFFU ? ffuInstruction : kichenInstruction;
          const protocolServingTime = getOptionValueById({ data: options, field: 'servingTimes', id: servingTime });

          const curWeeks = res.weeks || {};
          const curWeek = curWeeks[weekNo] || {};
          const curWeekServingTimes = curWeek.servingTimes || {};
          const curWeekServingTime = curWeekServingTimes[protocolServingTime] || {};
          const curWeekProtocols = curWeekServingTime.protocols || {};
          const curWeekProtocol = curWeekProtocols[protocolName] || {};
          const curProtocolQuantities = curWeekProtocol.quantities || {};
          const curProtocolQty = curProtocolQuantities[qty] || {};
          const curProtocolQtyGuests = curProtocolQty.guests || [];
          return {
            ...res,
            weeks: {
              ...curWeeks,
              [weekNo]: {
                ...curWeek,
                duration: weekData.duration,
                protocolDates,
                servingTimes: {
                  ...curWeekServingTimes,
                  [protocolServingTime]: {
                    ...curWeekServingTime,
                    protocols: {
                      ...curWeekProtocols,
                      [protocolName]: {
                        ...curWeekProtocol,
                        isFFU,
                        protocolName,
                        quantities: {
                          ...curProtocolQuantities,
                          [qty]: {
                            ...curProtocolQty,
                            guests: [...curProtocolQtyGuests, guests[guestId].firstName],
                            guestNo: curProtocolQtyGuests.length + 1,
                            protocolInfo,
                            protocolTitle,
                            additionalInstructionForKitchen: htmlToArray(additionalInstructionForKitchen)
                              .map((par) => htmlToText(par)),
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          };
        }, reportData);
    }
  }

  if (!reportData.weeks) {
    logger.log('No data');
    return;
  }

  for (let weekIndex = 0; weekIndex < Object.keys(reportData.weeks).length; weekIndex++) {
    const weekNo = Object.keys(reportData.weeks)[weekIndex];
    const weekData = reportData.weeks[weekNo];
    const servingData = weekData.servingTimes;

    const data = {
      weekNo,
      duration: weekData.duration,
      protocolDates: weekData.protocolDates,
      protocols8AM: [],
      protocols9AM: [],
      protocols1PM: [],
      protocols5PM: [],
    };
    Object.keys(servingData).forEach((servingTime) => {
      const serveProtocols = servingData[servingTime].protocols;
      Object.keys(serveProtocols).forEach((protocolName) => {
        if (servingTime === '8:00 AM') {
          data.protocols8AM.push({
            isFFU: serveProtocols[protocolName].isFFU,
            quantity: Object
              .entries(serveProtocols[protocolName].quantities)
              .map(([qty, protocol]) => ({ ...protocol, qty, guestNames: protocol.guests.join(', ') })),
            protocolName,
          });
        } else if (servingTime === '9:00 AM') {
          data.protocols9AM.push({
            isFFU: serveProtocols[protocolName].isFFU,
            quantity: Object
              .entries(serveProtocols[protocolName].quantities)
              .map(([qty, protocol]) => ({ ...protocol, qty, guestNames: protocol.guests.join(', ') })),
            protocolName,
          });
        } else if (servingTime === '1:00 PM') {
          data.protocols1PM.push({
            isFFU: serveProtocols[protocolName].isFFU,
            quantity: Object
              .entries(serveProtocols[protocolName].quantities)
              .map(([qty, protocol]) => ({ ...protocol, qty, guestNames: protocol.guests.join(', ') })),
            protocolName,
          });
        } else if (servingTime === '5:00 PM') {
          data.protocols5PM.push({
            isFFU: serveProtocols[protocolName].isFFU,
            quantity: Object
              .entries(serveProtocols[protocolName].quantities)
              .map(([qty, protocol]) => ({ ...protocol, qty, guestNames: protocol.guests.join(', ') })),
            protocolName,
          });
        }
      });
    });

    reportHandler.handleGenerateMealsReport(data);
  }
};

export const generateTotalQuantitiesReport = ({
  guests,
  options,
  formData,
  guestsData,
  currentSession,
  guestProtocols,
}) => {
  let reportData = {};
  for (let guestIndex = 0; guestIndex < guestsData.length; guestIndex++) {
    const guestSessionId = guestsData[guestIndex];
    const guest = formData.guests.find((g) => g.id === guestSessionId);
    const { guestId } = guest;
    const filterWeeks = Object.values(formData.weeks).filter((w) => w.checked).map((w) => w.id);
    const weeks = guest.sessionWeeks.filter((weekNo) => filterWeeks.includes(weekNo));
    for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
      const weekNo = weeks[weekIndex];
      reportData = Object
        .values(guestProtocols)
        .filter((gp) => (
          gp.guestId === guestId
          && gp.sessionId === currentSession
          && gp.week === weekNo
          && !gp.archived))
        .reduce((res, cur) => {
          const {
            qty,
            days,
            protocolName,
            protocolUnit,
            howToPrepare } = cur;

          const unit = getUnitByQty({ data: options, id: protocolUnit, qty: +qty });
          const guestName = `${guests[guestId].firstName} ${guests[guestId].lastName[0]}.`;

          const curWeeks = res.weeks || {};
          const curWeek = curWeeks[weekNo] || {};
          const curWeekGuests = (curWeek.guests || []).filter((g) => g !== guestName);
          const curWeekProtocols = curWeek.protocols || {};
          const curWeekProtocol = curWeekProtocols[protocolName] || {};
          const curWeekProtocolUnits = curWeekProtocol.units || {};
          const curWeekProtocolUnit = curWeekProtocolUnits[unit] || {};
          const curWeekProtocolQty = curWeekProtocolUnit.totalQty || 0;

          const protocolDays = formData.onThuAll ? 3 : days;

          return {
            ...res,
            weeks: {
              ...curWeeks,
              [weekNo]: {
                ...curWeek,
                guests: [...curWeekGuests, guestName],
                protocols: {
                  ...curWeekProtocols,
                  [protocolName]: {
                    ...curWeekProtocol,
                    name: protocolName,
                    unit,
                    units: {
                      ...curWeekProtocolUnits,
                      [unit]: {
                        totalQty: curWeekProtocolQty + qty * protocolDays,
                      },
                    },
                    howToPrepare: htmlToText(howToPrepare),
                  },
                },
              },
            },
          };
        }, reportData);
    }
  }

  if (!reportData.weeks) {
    logger.log('No data');
    return;
  }

  for (let weekIndex = 0; weekIndex < Object.keys(reportData.weeks).length; weekIndex++) {
    const weekNo = Object.keys(reportData.weeks)[weekIndex];
    const weekData = reportData.weeks[weekNo];
    const protocolData = weekData.protocols;

    const data = {
      weekNo,
      guestNo: weekData.guests.length,
      guestNames: weekData.guests.join(', '),
      protocols: [],
    };

    Object.values(protocolData).forEach(({ name, unit, howToPrepare, units }) => {
      Object.values(units).forEach(({ totalQty }) => {
        data.protocols.push({
          name,
          unit,
          totalQty,
          isHowToData: howToPrepare && howToPrepare.length > 0,
          howToPrepare,
        });
      });
    });

    const sortedProtocols = data.protocols.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    reportHandler.generateTotalQuantitiesReport({ ...data, protocols: sortedProtocols });
  }
};

export const generatePickPackKitchenReport = ({
  guests,
  options,
  formData,
  guestsData,
  currentSession,
  guestProtocols,
}) => {
  let reportData = {};
  for (let guestIndex = 0; guestIndex < guestsData.length; guestIndex++) {
    const guestSessionId = guestsData[guestIndex];
    const guest = formData.guests.find((g) => g.id === guestSessionId);
    const { guestId } = guest;
    const filterWeeks = Object.values(formData.weeks).filter((w) => w.checked).map((w) => w.id);
    const weeks = guest.sessionWeeks.filter((weekNo) => filterWeeks.includes(weekNo));
    for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
      const weekNo = weeks[weekIndex];
      const servingTypeId = getOptionIdByValue({ data: options, field: 'servingTypes', value: 'Kitchen Serve' });
      reportData = Object
        .values(guestProtocols)
        .filter((gp) => (
          gp.guestId === guestId
          && gp.sessionId === currentSession
          && gp.week === weekNo
          && gp.servingType === servingTypeId
          && !gp.archived))
        .reduce((res, cur) => {
          const {
            qty,
            days,
            protocolName,
            protocolUnit,
            howToPrepare } = cur;

          const unit = getUnitByQty({ data: options, id: protocolUnit, qty: +qty });
          const guestName = `${guests[guestId].firstName} ${guests[guestId].lastName[0]}.`;

          const curWeeks = res.weeks || {};
          const curWeek = curWeeks[weekNo] || {};
          const curWeekGuests = (curWeek.guests || []).filter((g) => g !== guestName);
          const curWeekProtocols = curWeek.protocols || {};
          const curWeekProtocol = curWeekProtocols[protocolName] || {};
          const curWeekProtocolUnits = curWeekProtocol.units || {};
          const curWeekProtocolUnit = curWeekProtocolUnits[unit] || {};
          const curWeekProtocolQty = curWeekProtocolUnit.totalQty || 0;

          const protocolDays = formData.onThuAll ? 3 : days;

          return {
            ...res,
            weeks: {
              ...curWeeks,
              [weekNo]: {
                ...curWeek,
                guests: [...curWeekGuests, guestName],
                protocols: {
                  ...curWeekProtocols,
                  [protocolName]: {
                    ...curWeekProtocol,
                    name: protocolName,
                    unit,
                    units: {
                      ...curWeekProtocolUnits,
                      [unit]: {
                        totalQty: curWeekProtocolQty + qty * protocolDays,
                      },
                    },
                    howToPrepare: htmlToText(howToPrepare),
                  },
                },
              },
            },
          };
        }, reportData);
    }
  }

  if (!reportData.weeks) {
    logger.log('No data');
    return;
  }

  for (let weekIndex = 0; weekIndex < Object.keys(reportData.weeks).length; weekIndex++) {
    const weekNo = Object.keys(reportData.weeks)[weekIndex];
    const weekData = reportData.weeks[weekNo];
    const protocolData = weekData.protocols;

    const data = {
      weekNo,
      guestNo: weekData.guests.length,
      guestNames: weekData.guests.join(', '),
      protocols: [],
    };

    Object.values(protocolData).forEach(({ name, unit, howToPrepare, units }) => {
      Object.values(units).forEach(({ totalQty }) => {
        data.protocols.push({
          name,
          unit,
          totalQty,
          isHowToData: howToPrepare && howToPrepare.length > 0,
          howToPrepare,
        });
      });
    });

    const sortedProtocols = data.protocols.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    reportHandler.generatePicknPackKitchenReport({ ...data, protocols: sortedProtocols });
  }
};

export const generatePickPackSelfServeReport = ({
  guests,
  options,
  formData,
  guestsData,
  currentSession,
  guestProtocols,
}) => {
  let reportData = {};
  for (let guestIndex = 0; guestIndex < guestsData.length; guestIndex++) {
    const guestSessionId = guestsData[guestIndex];
    const guest = formData.guests.find((g) => g.id === guestSessionId);
    const { guestId } = guest;
    const filterWeeks = Object.values(formData.weeks).filter((w) => w.checked).map((w) => w.id);
    const weeks = guest.sessionWeeks.filter((weekNo) => filterWeeks.includes(weekNo));
    for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
      const weekNo = weeks[weekIndex];
      const servingTypeId = getOptionIdByValue({ data: options, field: 'servingTypes', value: 'Self-Serve' });
      reportData = Object
        .values(guestProtocols)
        .filter((gp) => (
          gp.guestId === guestId
          && gp.sessionId === currentSession
          && gp.week === weekNo
          && gp.servingType === servingTypeId
          && !gp.archived))
        .reduce((res, cur) => {
          const {
            qty,
            days,
            protocolName,
            protocolUnit,
            howToPrepare } = cur;

          const unit = getUnitByQty({ data: options, id: protocolUnit, qty: +qty });
          const guestName = `${guests[guestId].firstName} ${guests[guestId].lastName[0]}.`;

          const curWeeks = res.weeks || {};
          const curWeek = curWeeks[weekNo] || {};
          const curWeekGuests = (curWeek.guests || []).filter((g) => g !== guestName);
          const curWeekProtocols = curWeek.protocols || {};
          const curWeekProtocol = curWeekProtocols[protocolName] || {};
          const curWeekProtocolUnits = curWeekProtocol.units || {};
          const curWeekProtocolUnit = curWeekProtocolUnits[unit] || {};
          const curWeekProtocolQty = curWeekProtocolUnit.totalQty || 0;

          const protocolDays = formData.onThuAll ? 3 : days;

          return {
            ...res,
            weeks: {
              ...curWeeks,
              [weekNo]: {
                ...curWeek,
                guests: [...curWeekGuests, guestName],
                protocols: {
                  ...curWeekProtocols,
                  [protocolName]: {
                    ...curWeekProtocol,
                    name: protocolName,
                    unit,
                    units: {
                      ...curWeekProtocolUnits,
                      [unit]: {
                        totalQty: curWeekProtocolQty + qty * protocolDays,
                      },
                    },
                    howToPrepare: htmlToText(howToPrepare),
                  },
                },
              },
            },
          };
        }, reportData);
    }
  }

  if (!reportData.weeks) {
    logger.log('No data');
    return;
  }

  for (let weekIndex = 0; weekIndex < Object.keys(reportData.weeks).length; weekIndex++) {
    const weekNo = Object.keys(reportData.weeks)[weekIndex];
    const weekData = reportData.weeks[weekNo];
    const protocolData = weekData.protocols;

    const data = {
      weekNo,
      guestNo: weekData.guests.length,
      guestNames: weekData.guests.join(', '),
      protocols: [],
    };

    Object.values(protocolData).forEach(({ name, unit, howToPrepare, units }) => {
      Object.values(units).forEach(({ totalQty }) => {
        data.protocols.push({
          name,
          unit,
          totalQty,
          isHowToData: howToPrepare && howToPrepare.length > 0,
          howToPrepare,
        });
      });
    });

    const sortedProtocols = data.protocols.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    reportHandler.generatePicknPackSelfServeReport({ ...data, protocols: sortedProtocols });
  }
};

export const generateLabelsReport = () => {};
