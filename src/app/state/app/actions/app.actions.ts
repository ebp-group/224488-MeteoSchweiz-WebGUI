import {createActionGroup, props} from '@ngrx/store';
import {Language} from '../../../shared/models/language';

export const appActions = createActionGroup({
  source: 'App',
  events: {
    'Set language': props<{language: Language}>(),
  },
});
