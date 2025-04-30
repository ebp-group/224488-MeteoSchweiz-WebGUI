import {formStepConstants} from '../../../shared/constants/form-step.constant';
import {formActions} from '../actions/form.actions';
import {FormState} from '../states/form.state';
import {formFeature, initialState} from './form.reducer';

describe('Form Reducer', () => {
  let state: FormState;

  beforeEach(() => {
    state = {
      selectedMeasurementDataType: 'normal',
      selectedParameterGroupId: 'A',
      selectedStationId: 'ALT',
      selectedDataInterval: 'daily',
      selectedTimeRange: 'historical',
      selectedCollection: 'collection',
      selectedHistoricalDateRange: {start: new Date(), end: new Date()},
      isParameterGroupStationAndCollectionInitialized: false,
      isDataIntervalAndTimeRangeInitialized: false,
      initialStep: formStepConstants.STATION_SELECTION,
    };
  });

  it('should initialize measurement data type without changing anything else', () => {
    const action = formActions.initializeSelectedMeasurementDataType({measurementDataType: 'homogenous'});

    const result = formFeature.reducer(state, action);

    expect(result).toEqual({...state, selectedMeasurementDataType: 'homogenous'});
  });

  it('should reset the form state when a measurement data type is selected', () => {
    const action = formActions.setSelectedMeasurementDataType({measurementDataType: 'homogenous'});

    const result = formFeature.reducer(state, action);

    expect(result).toEqual({...initialState, selectedMeasurementDataType: 'homogenous'});
  });

  it('should reset selection of upcoming steps if parameter group ID is selected', () => {
    const action = formActions.setSelectedParameters({parameterGroupId: 'test'});

    const result = formFeature.reducer(state, action);

    expect(result).toEqual({
      ...initialState,
      selectedMeasurementDataType: 'normal',
      selectedParameterGroupId: 'test',
    });
  });

  it('should reset selection of upcoming steps if station ID is selected', () => {
    const action = formActions.setSelectedStationId({stationId: 'test'});

    const result = formFeature.reducer(state, action);

    expect(result).toEqual({
      ...initialState,
      selectedMeasurementDataType: 'normal',
      selectedParameterGroupId: 'A',
      selectedStationId: 'test',
    });
  });

  it('should initialize parameter group and station ID, collection and initial step without changing anything else', () => {
    const action = formActions.initializeSelectedParameterGroupAndStationIdAndCollection({
      parameterGroupId: 'paramGroupTest',
      stationId: 'stationTest',
      collection: 'collectionTest',
    });

    const result = formFeature.reducer(state, action);

    expect(result).toEqual({
      ...state,
      selectedParameterGroupId: 'paramGroupTest',
      selectedStationId: 'stationTest',
      selectedCollection: 'collectionTest',
      isParameterGroupStationAndCollectionInitialized: true,
      initialStep: formStepConstants.INTERVAL_SELECTION,
    });
  });

  it('should initialize data interval, time range, historical date range and initial step without changing anything else', () => {
    const action = formActions.initializeSelectedDataIntervalAndTimeRange({
      dataInterval: 'monthly',
      timeRange: 'now',
      historicalDateRange: {start: new Date('2025-01-01T00:00Z'), end: new Date('2025-01-01T00:00Z')},
    });

    const result = formFeature.reducer(state, action);

    expect(result).toEqual({
      ...state,
      selectedDataInterval: 'monthly',
      selectedTimeRange: 'now',
      selectedHistoricalDateRange: {start: new Date('2025-01-01T00:00Z'), end: new Date('2025-01-01T00:00Z')},
      initialStep: formStepConstants.SELECTION_REVIEW,
      isDataIntervalAndTimeRangeInitialized: true,
    });
  });

  it('should reset selection of upcoming steps if collection is selected', () => {
    const action = formActions.setSelectedCollection({collection: 'other'});

    const result = formFeature.reducer(state, action);

    expect(result).toEqual({
      ...initialState,
      selectedMeasurementDataType: 'normal',
      selectedParameterGroupId: 'A',
      selectedStationId: 'ALT',
      selectedCollection: 'other',
    });
  });

  it('should reset selection of upcoming steps if dataInterval is selected', () => {
    const action = formActions.setSelectedDataInterval({dataInterval: 'monthly'});

    const result = formFeature.reducer(state, action);

    expect(result).toEqual({
      ...initialState,
      selectedMeasurementDataType: 'normal',
      selectedParameterGroupId: 'A',
      selectedStationId: 'ALT',
      selectedDataInterval: 'monthly',
      selectedCollection: 'collection',
    });
  });

  it('should just set time range if it is selected', () => {
    const action = formActions.setSelectedTimeRange({
      timeRange: 'now',
      historicalDateRange: {start: new Date('2025-01-01T00:00Z'), end: new Date('2025-01-01T00:00Z')},
    });

    const result = formFeature.reducer(state, action);

    expect(result).toEqual({
      ...state,
      selectedMeasurementDataType: 'normal',
      selectedParameterGroupId: 'A',
      selectedStationId: 'ALT',
      selectedDataInterval: 'daily',
      selectedTimeRange: 'now',
      selectedCollection: 'collection',
      selectedHistoricalDateRange: {start: new Date('2025-01-01T00:00Z'), end: new Date('2025-01-01T00:00Z')},
    });
  });
});
