import type {LoadingState} from '../../../shared/models/loading-state';
import type {Parameter} from '../../../shared/models/parameter';

export interface ParameterState {
  parameters: Parameter[];
  loadingState: LoadingState;
}
