import {createFeature, createReducer, on} from '@ngrx/store';
import {mapActions} from '../actions/map.action';
import {MapState} from '../states/map.state';

export const mapFeatureKey = 'maps';

export const initialState: MapState = {
  loadingState: undefined,
  zoom: undefined,
  center: undefined,
};

export const mapFeature = createFeature({
  name: mapFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      mapActions.loadMap,
      (state): MapState => ({
        ...state,
        loadingState: state.loadingState !== 'loaded' ? 'loading' : state.loadingState,
      }),
    ),
    on(
      mapActions.setMapAsLoaded,
      (state): MapState => ({
        ...state,
        loadingState: 'loaded',
      }),
    ),
    on(
      mapActions.setMapLoadingError,
      (): MapState => ({
        ...initialState,
        loadingState: 'error',
      }),
    ),
    on(
      mapActions.resetState,
      (): MapState => ({
        ...initialState,
      }),
    ),
    on(
      mapActions.setZoom,
      (state, {zoom}): MapState => ({
        ...state,
        zoom,
      }),
    ),
    on(
      mapActions.setCenter,
      (state, {center}): MapState => ({
        ...state,
        center,
      }),
    ),
  ),
});
