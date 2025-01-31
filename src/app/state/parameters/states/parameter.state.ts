import {Parameter} from '../../../shared/models/parameter';

export interface ParameterState {
  parameters: Parameter[];
  loadingState: undefined | 'loading' | 'loaded';
}
