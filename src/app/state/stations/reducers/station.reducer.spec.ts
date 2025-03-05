import {collectionConfig} from '../../../shared/configs/collections.config';
import {stationActions} from '../actions/station.action';
import {initialState, stationFeature} from './station.reducer';
import type {Station} from '../../../shared/models/station';
import type {StationState} from '../states/station.state';

describe('Station Reducer', () => {
  const measurementDataType = collectionConfig.defaultMeasurementDataType;

  let state: StationState;

  beforeEach(() => {
    state = structuredClone(initialState);
  });

  it('should set loadingState to loading when loadStationForCollections is dispatched and loading state is currently not loaded', () => {
    state[measurementDataType].loadingState = 'error';
    const action = stationActions.loadStationsForCollections({collections: ['test'], measurementDataType});

    const result = stationFeature.reducer(state, action);

    expect(result[measurementDataType].loadingState).toBe('loading');
    expect(result[measurementDataType].stations).toEqual([]);
  });

  it('should not change loadingState if it is already loaded when loadStationForCollections is dispatched', () => {
    state[measurementDataType].loadingState = 'loaded';
    const action = stationActions.loadStationsForCollections({collections: ['test'], measurementDataType});

    const result = stationFeature.reducer(state, action);

    expect(result[measurementDataType].loadingState).toBe('loaded');
    expect(result[measurementDataType].stations).toEqual([]);
  });

  it('should set stations and loadingState to loaded when setLoadedStations is dispatched', () => {
    const stations: Station[] = [
      {
        id: 'test-station-id',
        name: 'Test station name',
        displayName: 'Test station display name',
        coordinates: {longitude: 0, latitude: 0},
      },
    ];
    const action = stationActions.setLoadedStations({stations, measurementDataType});

    const result = stationFeature.reducer(state, action);

    expect(result[measurementDataType].loadingState).toBe('loaded');
    expect(result[measurementDataType].stations).toEqual(stations);
  });

  it('should reset to initialState and set loadingState to error when setStationLoadingError is dispatched', () => {
    const action = stationActions.setStationLoadingError({measurementDataType});

    const result = stationFeature.reducer(state, action);

    expect(result).toEqual({
      ...initialState,
      [measurementDataType]: {...initialState[measurementDataType], loadingState: 'error'},
    });
  });
});
