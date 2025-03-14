import {DataInterval} from './interval';
import {Language} from './language';
import {MeasurementDataType} from './measurement-data-type';
import {TimeRange} from './time-range';

export interface AppUrlParameter {
  language: Language;
  measurementDataType: MeasurementDataType;
  parameterGroupId: string | null;
  stationId: string | null;
  collection: string | null;
  dataInterval: DataInterval | null;
  timeRange: TimeRange | null;
}
