import {
  MS_PER_DAY,
  MS_PER_HOUR,
  MS_PER_MINUTE,
  MS_PER_YEAR,
} from "../constants/time";

export const fiveMinutesAgo = () => new Date(Date.now() - 5 * MS_PER_MINUTE);
export const fifteenMinutesFromNow = () =>
  new Date(Date.now() + 15 * MS_PER_MINUTE);
export const oneHourFromNow = () => new Date(Date.now() + MS_PER_HOUR);
export const oneYearFromNow = () => new Date(Date.now() + MS_PER_YEAR);
export const thirtyDaysFromNow = () => new Date(Date.now() + 30 * MS_PER_DAY);
export const oneDayFromNow = () => new Date(Date.now() + MS_PER_DAY);
