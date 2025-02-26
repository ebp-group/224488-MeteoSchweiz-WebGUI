import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Coordinates} from '../../../shared/models/coordinates';
import {errorProps} from '../../utils/error-props.util';

export const mapActions = createActionGroup({
  source: 'Maps',
  events: {
    'Load map': emptyProps(),
    'Set map as loaded': emptyProps(),
    'Set map loading error': errorProps(),
    'Reset state': emptyProps(),
    'Set zoom': props<{zoom: number}>(),
    'Set center': props<{center: Coordinates}>(),
  },
});
