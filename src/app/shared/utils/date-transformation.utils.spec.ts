import {transformDateToString, transformStringToDate} from './date-transformation.utils';

describe('transformDateToString', () => {
  it('returns a formatted date string for a valid date object', () => {
    const date = new Date(2023, 0, 1);
    const result = transformDateToString(date);
    expect(result).toBe('20230101');
  });

  it('returns a formatted date string for a date object ignoring time (HH:mm:ss...) data', () => {
    const date = new Date(2023, 11, 31, 23, 59, 59);
    const result = transformDateToString(date);
    expect(result).toBe('20231231');
  });
});

describe('transformStringToDate', () => {
  it('returns a date object for a string in the format YYYYMMDD', () => {
    const result = transformStringToDate('20231231');
    expect(result).toEqual(new Date(2023, 11, 31));
  });

  it('returns undefined for an undefined input', () => {
    const result = transformStringToDate(undefined);
    expect(result).toBeUndefined();
  });
});
