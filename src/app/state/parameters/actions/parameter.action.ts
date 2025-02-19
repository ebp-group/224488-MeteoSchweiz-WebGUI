import {createActionGroup, props} from '@ngrx/store';
import {errorProps} from '../../utils/error-props.util';
import type {Parameter} from '../../../shared/models/parameter';

export const parameterActions = createActionGroup({
  source: 'Parameters',
  events: {
    'Set loaded parameters': props<{parameters: Parameter[]}>(),
    'Load parameters for collections': props<{collections: string[]}>(),
    'Set parameter loading error': errorProps(),
  },
});
