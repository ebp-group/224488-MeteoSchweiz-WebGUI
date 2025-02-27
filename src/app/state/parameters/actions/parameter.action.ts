import {createActionGroup, props} from '@ngrx/store';
import {MeasurementDataType} from '../../../shared/models/measurement-data-type';
import type {Parameter} from '../../../shared/models/parameter';

export const parameterActions = createActionGroup({
  source: 'Parameters',
  events: {
    'Set loaded parameters': props<{parameters: Parameter[]; measurementDataType: MeasurementDataType}>(),
    'Load parameters for collections': props<{collections: string[]; measurementDataType: MeasurementDataType}>(),
    'Set parameter loading error': props<{error?: unknown; measurementDataType: MeasurementDataType}>(),
  },
});
