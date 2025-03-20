import {createActionGroup, props} from '@ngrx/store';
import {CollectionAsset} from '../../../shared/models/collection-assets';
import {MeasurementDataType} from '../../../shared/models/measurement-data-type';
import type {Parameter} from '../../../shared/models/parameter';

export const parameterActions = createActionGroup({
  source: 'Parameters',
  events: {
    'Set loaded parameters': props<{parameters: Parameter[]; measurementDataType: MeasurementDataType}>(),
    'Load parameters for collections': props<{
      collectionAssets: CollectionAsset[];
      measurementDataType: MeasurementDataType;
    }>(),
    'Set parameter loading error': props<{error?: unknown; measurementDataType: MeasurementDataType}>(),
  },
});
