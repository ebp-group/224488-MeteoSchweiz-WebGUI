import {dataIntervals} from '../models/interval';
import {isDataInterval} from './data-interval-guard';

describe('isDataInterval', () => {
  dataIntervals.forEach((dataInterval) => {
    it(`returns true for '${dataInterval}'`, () => {
      expect(isDataInterval(`${dataInterval}`)).toBe(true);
    });
  });

  it('returns false for a misspelled dataInterval string', () => {
    expect(isDataInterval('dayly')).toBe(false);
  });

  it('returns false for an uppercase dataInterval string', () => {
    expect(isDataInterval('DAILY')).toBe(false);
  });

  it('returns false for an invalid dataInterval', () => {
    expect(isDataInterval('whoopsy')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isDataInterval('')).toBe(false);
  });
});
