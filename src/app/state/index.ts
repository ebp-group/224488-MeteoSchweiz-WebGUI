import {failLoadingCollectionParameters, loadCollectionParameters, loadParameters} from './parameters/effects/parameter.effects';
import {parameterFeature, parameterFeatureKey} from './parameters/reducers/parameter.reducer';
import {loadCollectionStations, loadStations} from './stations/effects/station.effects';
import {stationFeature, stationFeatureKey} from './stations/reducers/station.reducer';
import type {Type} from '@angular/core';
import type {FunctionalEffect} from '@ngrx/effects';
import type {ActionReducerMap, MetaReducer} from '@ngrx/store';
import type {ParameterState} from './parameters/states/parameter.state';
import type {StationState} from './stations/states/station.state';

export interface State {
  [parameterFeatureKey]: ParameterState;
  [stationFeatureKey]: StationState;
}
export const reducers: ActionReducerMap<State> = {
  [parameterFeatureKey]: parameterFeature.reducer,
  [stationFeatureKey]: stationFeature.reducer,
};
export const effects: (Type<unknown> | Record<string, FunctionalEffect>)[] = [
  {loadCollectionParameters, loadParameters, failLoadingCollectionParameters},
  {loadStations, loadCollectionStations},
];
export const metaReducers: MetaReducer<State>[] = [];
