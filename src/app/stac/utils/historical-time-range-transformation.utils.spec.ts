import {DateRange} from '../../shared/models/date-range';
import {transformHistoricalDateRangeStringToDate, transformHistoricalDateRangeToString} from './historical-time-range-transformation.utils';

describe('transformHistoricalDateRangeStringToDate', () => {
  it('returns a DateRange object for a valid date range string', () => {
    const result = transformHistoricalDateRangeStringToDate('20230101-20231231');
    expect(result).toEqual({start: new Date(2023, 0, 1), end: new Date(2023, 11, 31)});
  });

  it('returns undefined for an undefined input', () => {
    const result = transformHistoricalDateRangeStringToDate(undefined);
    expect(result).toBeUndefined();
  });

  it('returns undefined for a date range string with invalid format', () => {
    const result = transformHistoricalDateRangeStringToDate('20230101/20231231');
    expect(result).toBeUndefined();
  });

  it('returns undefined for a date range string with non-numeric characters', () => {
    const result = transformHistoricalDateRangeStringToDate('2023AB01-2023CD31');
    expect(result).toBeUndefined();
  });

  it('returns undefined for a date range string with incomplete dates', () => {
    const result = transformHistoricalDateRangeStringToDate('20230101-202312');
    expect(result).toBeUndefined();
  });
});

describe('transformHistoricalDateRangeToString', () => {
  it('returns a formatted date range string for a valid DateRange object', () => {
    const dateRange: DateRange = {start: new Date(2023, 0, 1), end: new Date(2023, 11, 31)};
    const result = transformHistoricalDateRangeToString(dateRange);
    expect(result).toBe('20230101-20231231');
  });

  it('returns undefined for an undefined input', () => {
    const result = transformHistoricalDateRangeToString(undefined);
    expect(result).toBeUndefined();
  });
});
