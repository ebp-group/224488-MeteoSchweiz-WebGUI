import {Language} from './language';
import {MeasurementDataType} from './measurement-data-type';

export interface AppUrlParameter {
  language: Language;
  measurementDataType: MeasurementDataType;
  parameterGroupId: string | null;
  stationId: string | null;
}
