import {createFeature, createReducer, on} from '@ngrx/store';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {formActions} from '../actions/form.actions';
import {FormState} from '../states/form.state';

export const formFeatureKey = 'form';

export const initialState: FormState = {
  selectedParameterGroupId: null,
  selectedStationId: null,
  selectedDataInterval: null,
  selectedTimeRange: null,
  selectedMeasurementDataType: collectionConfig.defaultMeasurementDataType,
};

export const formFeature = createFeature({
  name: formFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      formActions.setSelectedParameters,
      (state, {parameterGroupId}): FormState => ({
        ...state,
        selectedParameterGroupId: parameterGroupId,
        selectedStationId: null,
        selectedDataInterval: null,
        selectedTimeRange: null,
      }),
    ),
    on(
      formActions.setSelectedStationId,
      (state, {stationId}): FormState => ({
        ...state,
        selectedStationId: stationId,
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
    on(
      formActions.setSelectedMeasurementDataType,
      (_, {measurementDataType}): FormState => ({...initialState, selectedMeasurementDataType: measurementDataType}),
    ),
  ),
});
