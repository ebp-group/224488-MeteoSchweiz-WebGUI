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
      selectedTimeRange: 'all-time',
      selectedCollection: 'collection',
    };
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
    const action = formActions.setSelectedTimeRange({timeRange: 'current-day'});

    const result = formFeature.reducer(state, action);

    expect(result).toEqual({
      selectedMeasurementDataType: 'normal',
      selectedParameterGroupId: 'A',
      selectedStationId: 'ALT',
      selectedDataInterval: 'daily',
      selectedTimeRange: 'current-day',
      selectedCollection: 'collection',
    });
  });
});
