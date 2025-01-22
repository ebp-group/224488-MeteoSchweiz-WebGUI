import {createFeature, createReducer, on} from '@ngrx/store';
import {FormState} from '../state/form.state';
import {formActions} from '../actions/form.actions';

export const formFeatureKey = 'form';

export const initialState: FormState = {
  selectedParameterGroup: null,
  selectedStation: null,
};

export const formFeature = createFeature({
  name: formFeatureKey,
  reducer: createReducer(
    initialState,
    on(formActions.selectParameterGroup, (state, {group}): FormState => ({...state, selectedParameterGroup: group})),
    on(formActions.selectStation, (state, {station}): FormState => ({...state, selectedStation: station})),
  ),
});
