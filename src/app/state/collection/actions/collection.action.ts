import {createActionGroup, props} from '@ngrx/store';
import {MeasurementDataType} from '../../../shared/models/measurement-data-type';

export const collectionActions = createActionGroup({
  source: 'Collections',
  events: {
    'Load collections': props<{collections: string[]; measurementDataType: MeasurementDataType}>(),
  },
});
