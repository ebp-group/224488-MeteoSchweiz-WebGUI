import {DataInterval} from '../../../shared/models/interval';
import {MeasurementDataType} from '../../../shared/models/measurement-data-type';
import {TimeRange} from '../../../shared/models/time-range';

export interface FormState {
  selectedParameterGroupId: string | null;
  selectedStationId: string | null;
  selectedDataInterval: DataInterval | null;
  selectedTimeRange: TimeRange | null;
  selectedMeasurementDataType: MeasurementDataType;
  selectedCollection: string | null;
}
