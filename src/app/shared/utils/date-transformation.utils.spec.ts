import {transformDateToString, transformStringToDate} from './date-transformation.utils';

describe('transformDateToString', () => {
  it('returns a formatted date string for a valid date object', () => {
    const date = new Date(2010, 0, 1);
    const result = transformDateToString(date);
    expect(result).toBe('2010');
  });

  it('returns a formatted date string for a date object ignoring days and months, as well as time (HH:mm:ss...) data', () => {
    const date = new Date(2023, 11, 31, 23, 59, 59);
    const result = transformDateToString(date);
    expect(result).toBe('2023');
  });
});

describe('transformStringToDate', () => {
  it('should return a date object for a string in the format YYYY', () => {
    const result = transformStringToDate('2010');
    expect(result).toEqual(new Date('2010'));
  });

  it('should return undefined for an undefined input', () => {
    const result = transformStringToDate(undefined);
    expect(result).toBeUndefined();
  });

  it('should return undefined if the input string is too short', () => {
    const result = transformStringToDate('123');
    expect(result).toBeUndefined();
  });

  it('should return undefined if the input string is not a number', () => {
    const result = transformStringToDate('asdf');
    expect(result).toBeUndefined();
  });
});
