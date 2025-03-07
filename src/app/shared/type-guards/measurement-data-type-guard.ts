import {MeasurementDataType, measurementDataTypes} from '../models/measurement-data-type';

export function isMeasurementDataType(value: string): value is MeasurementDataType {
  return measurementDataTypes.includes(value as MeasurementDataType);
}
