import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {StationState} from './station/state/station.state';
import {stationFeature} from './station/reducers/station.reducer';
import {FormState} from './form/state/form.state';
import {formFeature} from './form/reducers/form.reducer';

export interface State {
  stations: StationState;
  form: FormState;
}
export const reducers: ActionReducerMap<State> = {
  stations: stationFeature.reducer,
  form: formFeature.reducer,
};
export const effects = [];
export const metaReducers: MetaReducer<State>[] = [];
