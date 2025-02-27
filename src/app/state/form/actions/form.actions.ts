import {createActionGroup, props} from '@ngrx/store';
import type {DataInterval} from '../../../shared/models/interval';
import type {MeasurementDataType} from '../../../shared/models/measurement-data-type';
import type {TimeRange} from '../../../shared/models/time-range';

export const formActions = createActionGroup({
  source: 'Form',
  events: {
    'Set selected parameters': props<{parameterGroupId: string | null}>(),
    'Set selected dataInterval': props<{dataInterval: DataInterval}>(),
    'Set selected time range': props<{timeRange: TimeRange}>(),
    'Set selected measurement data type': props<{measurementDataType: MeasurementDataType}>(),
  },
});
