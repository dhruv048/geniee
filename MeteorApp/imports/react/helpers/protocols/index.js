export const getCurrentRulesDays = ({ customProtocolRules, week }) => {
  if (!customProtocolRules || !week) return null;
  const startRules = Object
    .values(customProtocolRules.protocolStartRules)
    .reduce((res, cur) => ({
      ...res,
      [cur.week]: {
        ...cur,
      },
    }), {});

  const exceptionsRules = Object
    .values(customProtocolRules.protocolExceptions)
    .filter((rule) => !rule.isIsotinicDay)
    .reduce((res, cur) => ({
      ...res,
      [cur.week]: {
        ...cur,
      },
    }), {});

  const currentRules = { ...startRules, ...exceptionsRules };
  const currentWeek = Object.values(currentRules).find((rule) => rule.week === week);

  return currentWeek && currentWeek.duration;
};
