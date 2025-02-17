import {Type} from '@angular/core';
import {FunctionalEffect} from '@ngrx/effects';
import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {extractParameterGroups, failLoadingCollectionParameters, loadCollectionParameters} from './parameters/effects/parameter.effects';
import {parameterFeature, parameterFeatureKey} from './parameters/reducers/parameter.reducer';
import {ParameterState} from './parameters/states/parameter.state';

export interface State {
  [parameterFeatureKey]: ParameterState;
}
export const reducers: ActionReducerMap<State> = {
  [parameterFeatureKey]: parameterFeature.reducer,
};
export const effects: (Type<unknown> | Record<string, FunctionalEffect>)[] = [
  {loadCollectionParameters, failLoadingCollectionParameters, extractParameterGroups},
];
export const metaReducers: MetaReducer<State>[] = [];
