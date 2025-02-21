import {createActionGroup, props} from '@ngrx/store';
import {FormState} from '../states/form.state';

export const formActions = createActionGroup({
  source: 'Form',
  events: {
    'Set selected parameters': props<{parameterGroupId: FormState['selectedParameterGroupId']}>(),
    'Set selected dataInterval': props<{dataInterval: FormState['selectedDataInterval']}>(),
    'Set selected time range': props<{timeRange: FormState['selectedTimeRange']}>(),
  },
});
