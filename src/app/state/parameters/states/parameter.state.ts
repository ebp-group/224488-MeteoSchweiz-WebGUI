import type {LoadingState} from '../../../shared/models/loading-state';
import type {Parameter, ParameterGroup} from '../../../shared/models/parameter';

export interface ParameterState {
  parameters: Parameter[];
  loadingState: LoadingState;
  groups: ParameterGroup[];
}
