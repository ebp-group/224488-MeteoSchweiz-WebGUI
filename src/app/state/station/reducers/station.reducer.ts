import {createFeature, createReducer, on} from '@ngrx/store';
import {StationState} from '../state/station.state';
import {stationActions} from '../actions/station.actions';

export const stationFeatureKey = 'stations';

export const initialState: StationState = {
  stations: [],
  stationParameters: [],
  stationParameterMappings: [],
};

export const stationFeature = createFeature({
  name: stationFeatureKey,
  reducer: createReducer(
    initialState,
    on(stationActions.setStations, (state, {stations}): StationState => ({...state, stations})),
    on(stationActions.setParameters, (state, {parameters}): StationState => ({...state, stationParameters: parameters})),
    on(stationActions.setStationParameterMappings, (state, {mappings}): StationState => ({...state, stationParameterMappings: mappings})),
  ),
});
