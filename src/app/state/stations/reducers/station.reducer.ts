import {createFeature, createReducer, on} from '@ngrx/store';
import {produce} from 'immer';
import {measurementDataTypes} from '../../../shared/models/measurement-data-type';
import {stationActions} from '../actions/station.action';
import {StationState, StationStateEntry} from '../states/station.state';

export const stationFeatureKey = 'stations';

export const initialEntryState: StationStateEntry = {
  stations: [],
  loadingState: undefined,
};
export const initialState: StationState = Object.fromEntries(measurementDataTypes.map((k) => [k, initialEntryState])) as StationState;

export const stationFeature = createFeature({
  name: stationFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      stationActions.loadStationsForCollections,
      produce((draft, {measurementDataType}) => {
        const state = draft[measurementDataType];
        state.loadingState = state.loadingState !== 'loaded' ? 'loading' : state.loadingState;
      }),
    ),
    on(
      stationActions.setLoadedStations,
      produce((draft, {measurementDataType, stations}) => {
        const state = draft[measurementDataType];
        state.stations = stations;
        state.loadingState = 'loaded';
      }),
    ),
    on(
      stationActions.setStationLoadingError,
      produce((draft, {measurementDataType}) => {
        draft[measurementDataType] = {...initialEntryState, loadingState: 'error'};
      }),
    ),
  ),
});
