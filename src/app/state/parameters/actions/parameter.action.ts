import {createActionGroup, props} from '@ngrx/store';
import {Parameter} from '../../../shared/models/parameter';

export const parameterActions = createActionGroup({
  source: 'Parameters',
  events: {
    'Set loaded parameters': props<{parameters: Parameter[]}>(),
    'Load parameter for collections': props<{collections: string[]}>(),
  },
});
