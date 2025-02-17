import {createFeature, createReducer, on} from '@ngrx/store';
import {formActions} from '../actions/form.actions';
import {FormState} from '../state/form.state';

export const formFeatureKey = 'form';

export const initialState: FormState = {
  selectedParameterGroupId: null,
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
      }),
    ),
  ),
});
