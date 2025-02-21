import {createFeature, createReducer, on} from '@ngrx/store';
import {formActions} from '../actions/form.actions';
import {FormState} from '../state/form.state';

export const formFeatureKey = 'form';

export const initialState: FormState = {
  selectedParameterGroupId: null,
  selectedDataInterval: null,
  selectedTimeRange: null,
};

export const formFeature = createFeature({
  name: formFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      formActions.setSelectedParameters,
      (state, {parameterGroupId: parameterId}): FormState => ({
        ...state,
        selectedParameterGroupId: parameterId,
        selectedDataInterval: null,
        selectedTimeRange: null,
      }),
    ),
    on(
      formActions.setSelectedDataInterval,
      (state, {dataInterval}): FormState => ({
        ...state,
        selectedDataInterval: dataInterval,
        selectedTimeRange: null,
      }),
    ),
    on(
      formActions.setSelectedTimeRange,
      (state, {timeRange}): FormState => ({
        ...state,
        selectedTimeRange: timeRange,
      }),
    ),
  ),
});
