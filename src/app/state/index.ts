import {formFeature, formFeatureKey} from './form/reducers/form.reducer';
import {addStationsToMap, filterStationsOnMap} from './map/effects/map.effects';
import {
  loadCollectionParameterStationMappings,
  loadParameterStationMappings,
} from './parameter-station-mapping/effects/parameter-station-mapping.effects';
import {
  parameterStationMappingFeature,
  parameterStationMappingFeatureKey,
} from './parameter-station-mapping/reducers/parameter-station-mapping.reducer';
import {ParameterStationMappingState} from './parameter-station-mapping/states/parameter-station-mapping.state';
import {failLoadingCollectionParameters, loadCollectionParameters, loadParameters} from './parameters/effects/parameter.effects';
import {parameterFeature, parameterFeatureKey} from './parameters/reducers/parameter.reducer';
import {loadCollectionStations, loadStations} from './stations/effects/station.effects';
import {stationFeature, stationFeatureKey} from './stations/reducers/station.reducer';
import type {Type} from '@angular/core';
import type {FunctionalEffect} from '@ngrx/effects';
import type {ActionReducerMap, MetaReducer} from '@ngrx/store';
import type {FormState} from './form/state/form.state';
import type {ParameterState} from './parameters/states/parameter.state';
import type {StationState} from './stations/states/station.state';

export interface State {
  [parameterFeatureKey]: ParameterState;
  [stationFeatureKey]: StationState;
  [formFeatureKey]: FormState;
  [parameterStationMappingFeatureKey]: ParameterStationMappingState;
}
export const reducers: ActionReducerMap<State> = {
  [parameterFeatureKey]: parameterFeature.reducer,
  [stationFeatureKey]: stationFeature.reducer,
  [formFeatureKey]: formFeature.reducer,
  [parameterStationMappingFeatureKey]: parameterStationMappingFeature.reducer,
};
export const effects: (Type<unknown> | Record<string, FunctionalEffect>)[] = [
  {loadCollectionParameters, loadParameters, failLoadingCollectionParameters},
  {loadStations, loadCollectionStations},
  {addStationsToMap, filterStationsOnMap},
  {loadParameterStationMappings, loadCollectionParameterStationMappings},
];
export const metaReducers: MetaReducer<State>[] = [];
