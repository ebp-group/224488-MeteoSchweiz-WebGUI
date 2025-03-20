import {createActionGroup, props} from '@ngrx/store';
import {AppUrlParameter} from '../../../shared/models/app-url-parameter';
import {Language} from '../../../shared/models/language';

export const appActions = createActionGroup({
  source: 'App',
  events: {
    'Initialize language': props<{language: Language}>(),
    'Set language': props<{language: Language}>(),
    'Initialize app': props<{parameter: AppUrlParameter}>(),
  },
});
