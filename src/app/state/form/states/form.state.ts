import {DataInterval} from '../../../shared/models/interval';
import {TimeRange} from '../../../shared/models/time-range';

export interface FormState {
  selectedParameterGroupId: string | null;
  selectedDataInterval: DataInterval | null;
  selectedTimeRange: TimeRange | null;
}
