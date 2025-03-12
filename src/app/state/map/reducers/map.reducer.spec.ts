import {mapActions} from '../actions/map.action';
import {MapState} from '../states/map.state';
import {initialState, mapFeature} from './map.reducer';

describe('Map Reducer', () => {
  let state: MapState;

  beforeEach(() => {
    state = structuredClone(initialState);
  });

  it('should set loadingState to loading when loadMap is dispatched and loading state is currently not loaded', () => {
    state = {...state, loadingState: 'error'};
    const action = mapActions.loadMap();
    const result = mapFeature.reducer(state, action);

    expect(result).toEqual({...state, loadingState: 'loading'});
  });

  it('should not change loadingState if it is already loaded when loadMap is dispatched', () => {
    state = {...state, loadingState: 'loaded'};
    const action = mapActions.loadMap();
    const result = mapFeature.reducer(state, action);

    expect(result).toEqual({...state, loadingState: 'loaded'});
  });

  it('should loadingState to loaded when setMapAsLoaded is dispatched', () => {
    const action = mapActions.setMapAsLoaded();
    const result = mapFeature.reducer(state, action);

    expect(result).toEqual({...state, loadingState: 'loaded'});
  });

  it('should reset to initialState and set loadingState to error when setMapLoadingError is dispatched', () => {
    state = {...state, zoom: 5, center: {latitude: 0, longitude: 0}};
    const action = mapActions.setMapLoadingError({});
    const result = mapFeature.reducer(state, action);

    expect(result).toEqual({...initialState, loadingState: 'error'});
  });

  it('should reset to initialState when resetState is dispatched', () => {
    state = {loadingState: 'loading', areLayersInitialized: true, zoom: 5, center: {latitude: 0, longitude: 0}};
    const action = mapActions.resetState();
    const result = mapFeature.reducer(state, action);

    expect(result).toEqual(initialState);
  });

  it('should set areLayersInitialized to `true` when completeLayersInitialization is dispatched', () => {
    state = {...state, areLayersInitialized: false};
    const action = mapActions.completeLayersInitialization();
    const result = mapFeature.reducer(state, action);

    expect(result).toEqual({...state, areLayersInitialized: true});
  });

  it('should set zoom when setZoom is dispatched', () => {
    const action = mapActions.setZoom({zoom: 5});
    const result = mapFeature.reducer(state, action);

    expect(result).toEqual({...state, zoom: 5});
  });

  it('should set center when setCenter is dispatched', () => {
    const action = mapActions.setCenter({center: {latitude: 0, longitude: 0}});
    const result = mapFeature.reducer(state, action);

    expect(result).toEqual({...state, center: {latitude: 0, longitude: 0}});
  });
});
