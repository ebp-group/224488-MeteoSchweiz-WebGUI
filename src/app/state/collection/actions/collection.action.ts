import {createActionGroup, props} from '@ngrx/store';
import type {CollectionAsset} from '../../../shared/models/collection-assets';
import type {MeasurementDataType} from '../../../shared/models/measurement-data-type';

export const collectionActions = createActionGroup({
  source: 'Collections',
  events: {
    'Load collections': props<{collections: string[]; measurementDataType: MeasurementDataType}>(),
    'Set collection assets': props<{assets: CollectionAsset[]; measurementDataType: MeasurementDataType}>(),
    'Set collection asset loading error': props<{error?: unknown; measurementDataType: MeasurementDataType}>(),
  },
});
