import {createActionGroup, props} from '@ngrx/store';
import {Station} from '../../../shared/models/station';
import {errorProps} from '../../utils/error-props.util';

export const stationActions = createActionGroup({
  source: 'Stations',
  events: {
    'Set loaded stations': props<{stations: Station[]}>(),
    'Load station for collections': props<{collections: string[]}>(),
    'Set station loading error': errorProps(),
  },
});
