import {LoadingState} from '../../../shared/models/loading-state';
import {Station} from '../../../shared/models/station';

export interface StationState {
  stations: Station[];
  loadingState: LoadingState;
}
