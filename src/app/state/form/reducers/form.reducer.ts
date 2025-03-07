import {createFeature, createReducer, on} from '@ngrx/store';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {formActions} from '../actions/form.actions';
import {FormState} from '../states/form.state';

export const formFeatureKey = 'form';

export const initialState: FormState = {
  selectedMeasurementDataType: collectionConfig.defaultMeasurementDataType,
  selectedParameterGroupId: null,
  selectedStationId: null,
  selectedDataInterval: null,
  selectedTimeRange: null,
  selectedCollection: null,
};

export const formFeature = createFeature({
  name: formFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      formActions.setSelectedMeasurementDataType,
      (_, {measurementDataType}): FormState => ({...initialState, selectedMeasurementDataType: measurementDataType}),
    ),
    on(
      formActions.setSelectedParameters,
      (state, {parameterGroupId}): FormState => ({
        ...state,
        selectedParameterGroupId: parameterGroupId,
        selectedStationId: null,
        selectedDataInterval: null,
        selectedTimeRange: null,
        selectedCollection: null,
      }),
    ),
    on(
      formActions.setSelectedStationId,
      (state, {stationId}): FormState => ({
        ...state,
        selectedStationId: stationId,
        selectedDataInterval: null,
        selectedTimeRange: null,
        selectedCollection: null,
      }),
    ),
    on(
      formActions.setSelectedParameterGroupAndStationId,
      (state, {parameterGroupId, stationId}): FormState => ({
        ...state,
        selectedParameterGroupId: parameterGroupId,
        selectedStationId: stationId,
        selectedCollection: null,
        selectedDataInterval: null,
        selectedTimeRange: null,
      }),
    ),
    on(
      formActions.setSelectedCollection,
      (state, {collection}): FormState => ({
        ...state,
        selectedCollection: collection,
        selectedDataInterval: null,
        selectedTimeRange: null,
      }),
    ),
    on(
      formActions.setSelectedDataInterval,
      (state, {dataInterval}): FormState => ({
        ...state,
        selectedDataInterval: dataInterval,
        selectedTimeRange: null,
      }),
    ),
    on(
      formActions.setSelectedTimeRange,
      (state, {timeRange}): FormState => ({
        ...state,
        selectedTimeRange: timeRange,
      }),
    ),
  ),
});
