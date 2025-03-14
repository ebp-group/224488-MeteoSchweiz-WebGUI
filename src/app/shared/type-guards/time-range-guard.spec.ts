import {timeRanges} from '../models/time-range';
import {isTimeRange} from './time-range-guard';

describe('isTimeRange', () => {
  timeRanges.forEach((timeRange) => {
    it(`returns true for '${timeRange}'`, () => {
      expect(isTimeRange(`${timeRange}`)).toBe(true);
    });
  });

  it('returns false for a misspelled timeRange string', () => {
    expect(isTimeRange('nov')).toBe(false);
  });

  it('returns false for an uppercase timeRange string', () => {
    expect(isTimeRange('NOW')).toBe(false);
  });

  it('returns false for an invalid timeRange', () => {
    expect(isTimeRange('whoopsy')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isTimeRange('')).toBe(false);
  });
});
