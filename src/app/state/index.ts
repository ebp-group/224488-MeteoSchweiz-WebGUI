import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {StationState} from './station/state/station.state';
import {stationFeature} from './station/reducers/station.reducer';

// This interface will be filled out later, then this eslint-disable line can be deleted

export interface State {
  stations: StationState;
}
export const reducers: ActionReducerMap<State> = {
  stations: stationFeature.reducer,
};
export const effects = [];
export const metaReducers: MetaReducer<State>[] = [];
