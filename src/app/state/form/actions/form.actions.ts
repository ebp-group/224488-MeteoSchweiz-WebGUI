import {createActionGroup, props} from '@ngrx/store';
import {Station, StationParameterGroup} from '../../../shared/types/station.types';

export const formActions = createActionGroup({
  source: 'Form',
  events: {
    'Select ParameterGroup': props<{group: StationParameterGroup | null}>(),
    'Select Station': props<{station: Station | null}>(),
  },
});
