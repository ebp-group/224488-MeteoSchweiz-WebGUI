import {createActionGroup, props} from '@ngrx/store';
import {CollectionAsset} from '../../../shared/models/collection-assets';
import {MeasurementDataType} from '../../../shared/models/measurement-data-type';
import {ParameterStationMapping} from '../../../shared/models/parameter-station-mapping';

export const parameterStationMappingActions = createActionGroup({
  source: 'ParameterStationMappings',
  events: {
    'Set loaded parameter station mappings': props<{
      parameterStationMappings: ParameterStationMapping[];
      measurementDataType: MeasurementDataType;
    }>(),
    'Load parameter station mappings for collections': props<{
      collectionAssets: CollectionAsset[];
      measurementDataType: MeasurementDataType;
    }>(),
    'Set parameter station mapping loading error': props<{error?: unknown; measurementDataType: MeasurementDataType}>(),
  },
});
