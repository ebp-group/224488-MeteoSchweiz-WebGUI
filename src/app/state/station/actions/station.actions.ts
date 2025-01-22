import {createActionGroup, props} from '@ngrx/store';
import {Station, StationParameter, StationParameterGroup, StationParameterMapping} from '../../../shared/types/station.types';

export const stationActions = createActionGroup({
  source: 'Station',
  events: {
    'Set Stations': props<{stations: Station[]}>(),
    'Set Parameters': props<{parameters: StationParameter[]}>(),
    'Set StationParameter mappings': props<{mappings: StationParameterMapping[]}>(),
    'Set ParameterGroups': props<{groups: StationParameterGroup[]}>(),
  },
});
