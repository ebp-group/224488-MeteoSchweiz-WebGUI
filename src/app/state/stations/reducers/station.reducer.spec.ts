import {stationActions} from '../actions/station.action';
import {initialState, stationFeature} from './station.reducer';
import type {Station} from '../../../shared/models/station';
import type {StationState} from '../states/station.state';

describe('Station Reducer', () => {
  let state: StationState;

  beforeEach(() => {
    state = initialState;
  });

  it('should set loadingState to loading when loadStationForCollections is dispatched and loading state is currently not loaded', () => {
    state = {...state, loadingState: 'error'};
    const action = stationActions.loadStationsForCollections({collections: ['test']});
    const result = stationFeature.reducer(state, action);

    expect(result.loadingState).toBe('loading');
    expect(result.stations).toEqual([]);
  });

  it('should not change loadingState if it is already loaded when loadStationForCollections is dispatched', () => {
    state = {...state, loadingState: 'loaded'};
    const action = stationActions.loadStationsForCollections({collections: ['test']});
    const result = stationFeature.reducer(state, action);

    expect(result.loadingState).toBe('loaded');
    expect(result.stations).toEqual([]);
  });

  it('should set stations and loadingState to loaded when setLoadedStations is dispatched', () => {
    const stations: Station[] = [
      {
        id: 'test-station-id',
        name: 'Test station name',
        coordinates: {lng: 0, lat: 0},
      },
    ];
    const action = stationActions.setLoadedStations({stations});
    const result = stationFeature.reducer(state, action);

    expect(result.loadingState).toBe('loaded');
    expect(result.stations).toEqual(stations);
  });

  it('should reset to initialState and set loadingState to error when setStationLoadingError is dispatched', () => {
    const action = stationActions.setStationLoadingError({});
    const result = stationFeature.reducer(state, action);

    expect(result).toEqual({...initialState, loadingState: 'error'});
  });
});
