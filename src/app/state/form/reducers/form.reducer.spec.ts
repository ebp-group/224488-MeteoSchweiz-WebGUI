import {formActions} from '../actions/form.actions';
import {FormState} from '../state/form.state';
import {formFeature, initialState} from './form.reducer';

describe('Parameter Reducer', () => {
  let state: FormState;

  beforeEach(() => {
    state = initialState;
  });

  it('should reset selection of upcoming steps if parameter is selected', () => {
    state = {...state, selectedParameterGroupId: 'A', selectedDataInterval: 'daily', selectedTimeRange: 'all-time'};
    const action = formActions.setSelectedParameters({parameterGroupId: 'test'});
    const result = formFeature.reducer(state, action);

    expect(result.selectedParameterGroupId).toBe('test');
    expect(result.selectedDataInterval).toBe(null);
    expect(result.selectedTimeRange).toBe(null);
  });

  it('should reset selection of upcoming steps if dataInterval is selected', () => {
    state = {...state, selectedParameterGroupId: 'A', selectedDataInterval: 'daily', selectedTimeRange: 'all-time'};
    const action = formActions.setSelectedDataInterval({dataInterval: 'monthly'});
    const result = formFeature.reducer(state, action);

    expect(result.selectedParameterGroupId).toBe('A');
    expect(result.selectedDataInterval).toBe('monthly');
    expect(result.selectedTimeRange).toBe(null);
  });
});
