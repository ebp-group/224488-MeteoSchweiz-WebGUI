import {createActionGroup, props} from '@ngrx/store';
import {FormState} from '../state/form.state';

export const formActions = createActionGroup({
  source: 'Form',
  events: {
    'Set selected parameters': props<{parameterGroupId: FormState['selectedParameterGroupId']}>(),
  },
});
