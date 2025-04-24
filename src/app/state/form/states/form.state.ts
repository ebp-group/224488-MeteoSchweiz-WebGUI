import type {FormStep} from '../../../shared/constants/form-step.constant';
import type {DateRange} from '../../../shared/models/date-range';
import type {DataInterval} from '../../../shared/models/interval';
import type {MeasurementDataType} from '../../../shared/models/measurement-data-type';
import type {TimeRange} from '../../../shared/models/time-range';

export interface FormState {
  selectedParameterGroupId: string | null;
  selectedStationId: string | null;
  selectedDataInterval: DataInterval | null;
  selectedTimeRange: TimeRange | null;
  selectedMeasurementDataType: MeasurementDataType;
  selectedCollection: string | null;
  selectedHistoricalDateRange: DateRange | null;
  isParameterGroupStationAndCollectionInitialized: boolean;
  initialStep: FormStep;
}
