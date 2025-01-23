import {createActionGroup, props} from '@ngrx/store';
import {AssetInterval, Station, StationAsset, StationParameterGroup} from '../../../shared/types/station.types';

export const formActions = createActionGroup({
  source: 'Form',
  events: {
    'Select ParameterGroup': props<{group: StationParameterGroup | null}>(),
    'Select Station': props<{station: Station | null}>(),
    'Set Interval Selection': props<{interval: AssetInterval | null}>(),
    'Select Assets form selected Station': props<{assets: StationAsset[]}>(),
  },
});
