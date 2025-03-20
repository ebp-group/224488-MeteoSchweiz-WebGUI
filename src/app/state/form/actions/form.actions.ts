import {createActionGroup, props} from '@ngrx/store';
import {DateRange} from '../../../shared/models/date-range';
import type {DataInterval} from '../../../shared/models/interval';
import type {MeasurementDataType} from '../../../shared/models/measurement-data-type';
import type {TimeRange} from '../../../shared/models/time-range';

export const formActions = createActionGroup({
  source: 'Form',
  events: {
    'Initialize selected measurement data type': props<{measurementDataType: MeasurementDataType}>(),
    'Initialize selected parameter group and station id and collection': props<{
      parameterGroupId: string | null;
      stationId: string | null;
      collection: string | null;
    }>(),
    'Set selected parameters': props<{parameterGroupId: string | null}>(),
    'Set selected station id': props<{stationId: string | null}>(),
    'Set selected dataInterval': props<{dataInterval: DataInterval}>(),
    'Set selected time range': props<{timeRange: TimeRange; historicalDateRange: DateRange | null}>(),
    'Set selected measurement data type': props<{measurementDataType: MeasurementDataType}>(),
    'Set selected collection': props<{collection: string | null}>(),
  },
});
