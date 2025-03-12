import {routerReducer, RouterState} from '@ngrx/router-store';
import * as appEffects from './app/effects/app.effects';
import * as urlParameterEffects from './app/effects/url-parameter.effects';
import {appFeature, appFeatureKey} from './app/reducers/app.reducer';
import {AppState} from './app/states/app.state';
import * as formEffects from './form/effects/form.effects';
import {formFeature, formFeatureKey} from './form/reducers/form.reducer';
import * as mapEffects from './map/effects/map.effects';
import {mapFeature, mapFeatureKey} from './map/reducers/map.reducer';
import {MapState} from './map/states/map.state';
import * as parameterStationMappingEffects from './parameter-station-mapping/effects/parameter-station-mapping.effects';
import {
  parameterStationMappingFeature,
  parameterStationMappingFeatureKey,
} from './parameter-station-mapping/reducers/parameter-station-mapping.reducer';
import {ParameterStationMappingState} from './parameter-station-mapping/states/parameter-station-mapping.state';
import * as parameterEffects from './parameters/effects/parameter.effects';
import {parameterFeature, parameterFeatureKey} from './parameters/reducers/parameter.reducer';
import * as stationEffects from './stations/effects/station.effects';
import {stationFeature, stationFeatureKey} from './stations/reducers/station.reducer';
import type {Type} from '@angular/core';
import type {FunctionalEffect} from '@ngrx/effects';
import type {ActionReducerMap, MetaReducer} from '@ngrx/store';
import type {FormState} from './form/states/form.state';
import type {ParameterState} from './parameters/states/parameter.state';
import type {StationState} from './stations/states/station.state';

export interface State {
  [parameterFeatureKey]: ParameterState;
  [stationFeatureKey]: StationState;
  [formFeatureKey]: FormState;
  [parameterStationMappingFeatureKey]: ParameterStationMappingState;
  [mapFeatureKey]: MapState;
  [appFeatureKey]: AppState;
  router: RouterState;
}
export const reducers: ActionReducerMap<State> = {
  [parameterFeatureKey]: parameterFeature.reducer,
  [stationFeatureKey]: stationFeature.reducer,
  [formFeatureKey]: formFeature.reducer,
  [parameterStationMappingFeatureKey]: parameterStationMappingFeature.reducer,
  [mapFeatureKey]: mapFeature.reducer,
  [appFeatureKey]: appFeature.reducer,
  router: routerReducer,
};
export const effects: (Type<unknown> | Record<string, FunctionalEffect>)[] = [
  parameterEffects,
  stationEffects,
  mapEffects,
  parameterStationMappingEffects,
  formEffects,
  appEffects,
  urlParameterEffects,
];
export const metaReducers: MetaReducer<State>[] = [];
