import {createActionGroup, props} from '@ngrx/store';
import {Parameter} from '../../../shared/models/parameter';
import {errorProps} from '../../utils/error-props.util';

export const parameterActions = createActionGroup({
  source: 'Parameters',
  events: {
    'Set loaded parameters': props<{parameters: Parameter[]}>(),
    'Load parameters for collections': props<{collections: string[]}>(),
    'Set parameter loading error': errorProps(),
  },
});
