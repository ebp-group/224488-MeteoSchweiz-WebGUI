import {MeasurementDataType} from '../measurement-data-type';

export interface CollectionsConfig {
  collections: Record<MeasurementDataType, string[]>;
  defaultMeasurementDataType: MeasurementDataType;
}
