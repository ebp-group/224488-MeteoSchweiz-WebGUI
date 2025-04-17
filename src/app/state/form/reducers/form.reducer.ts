import {createFeature, createReducer, on} from '@ngrx/store';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {FormStep} from '../../../shared/enums/form-step.enum';
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
  selectedHistoricalDateRange: null,
  isParameterGroupStationAndCollectionInitialized: false,
  initialStep: FormStep.StationSelection,
};

export const formFeature = createFeature({
  name: formFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      formActions.initializeSelectedMeasurementDataType,
      (state, {measurementDataType}): FormState => ({...state, selectedMeasurementDataType: measurementDataType}),
    ),
    on(
      formActions.initializeSelectedParameterGroupAndStationIdAndCollection,
      (state, {parameterGroupId, stationId, collection}): FormState => ({
        ...state,
        selectedParameterGroupId: parameterGroupId,
        selectedStationId: stationId,
        selectedCollection: collection,
        isParameterGroupStationAndCollectionInitialized: true,
        initialStep: stationId != null && collection != null ? FormStep.IntervalSelection : FormStep.StationSelection,
      }),
    ),
    on(formActions.initializeSelectedDataIntervalAndTimeRange, (state, {dataInterval, timeRange, historicalDateRange}): FormState => {
      let initialStep = state.initialStep;
      if (dataInterval != null && timeRange != null) {
        initialStep = FormStep.SelectionReview;
      } else if (dataInterval != null) {
        initialStep = FormStep.TimeRangeSelection;
      }
      return {
        ...state,
        selectedDataInterval: dataInterval,
        selectedTimeRange: timeRange,
        selectedHistoricalDateRange: historicalDateRange,
        initialStep,
      };
    }),
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
        selectedHistoricalDateRange: null,
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
        selectedHistoricalDateRange: null,
      }),
    ),
    on(
      formActions.setSelectedCollection,
      (state, {collection}): FormState => ({
        ...state,
        selectedCollection: collection,
        selectedDataInterval: null,
        selectedTimeRange: null,
        selectedHistoricalDateRange: null,
      }),
    ),
    on(
      formActions.setSelectedDataInterval,
      (state, {dataInterval}): FormState => ({
        ...state,
        selectedDataInterval: dataInterval,
        selectedTimeRange: null,
        selectedHistoricalDateRange: null,
      }),
    ),
    on(
      formActions.setSelectedTimeRange,
      (state, {timeRange, historicalDateRange}): FormState => ({
        ...state,
        selectedTimeRange: timeRange,
        selectedHistoricalDateRange: historicalDateRange,
      }),
    ),
  ),
});
