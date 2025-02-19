import {createFeature, createReducer, on} from '@ngrx/store';
import {stationActions} from '../actions/station.action';
import {StationState} from '../states/station.state';

export const stationFeatureKey = 'stations';

export const initialState: StationState = {
  stations: [],
  loadingState: undefined,
};

export const stationFeature = createFeature({
  name: stationFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      stationActions.loadStationsForCollections,
      (state): StationState => ({
        ...state,
        loadingState: state.loadingState !== 'loaded' ? 'loading' : state.loadingState,
      }),
    ),
    on(
      stationActions.setLoadedStations,
      (state, {stations}): StationState => ({
        ...state,
        loadingState: 'loaded',
        stations: stations,
      }),
    ),
    on(
      stationActions.setStationLoadingError,
      (): StationState => ({
        ...initialState,
        loadingState: 'error',
      }),
    ),
  ),
});
