import {measurementDataTypes} from '../models/measurement-data-type';
import {isMeasurementDataType} from './measurement-data-type-guard';

describe('isMeasurementDataType', () => {
  measurementDataTypes.forEach((measurementDataType) => {
    it(`returns true for '${measurementDataType}'`, () => {
      expect(isMeasurementDataType(`${measurementDataType}`)).toBe(true);
    });
  });

  it('returns false for a misspelled measurementDataType string', () => {
    expect(isMeasurementDataType('normalx')).toBe(false);
  });

  it('returns false for an uppercase measurementDataType string', () => {
    expect(isMeasurementDataType('NORMAL')).toBe(false);
  });

  it('returns false for an invalid measurementDataType', () => {
    expect(isMeasurementDataType('whoopsy')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isMeasurementDataType('')).toBe(false);
  });
});
