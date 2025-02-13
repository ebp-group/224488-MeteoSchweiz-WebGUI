import {LoadingState} from '../../../shared/models/loading-state';
import {Parameter} from '../../../shared/models/parameter';

export interface ParameterState {
  parameters: Parameter[];
  loadingState: LoadingState;
}
