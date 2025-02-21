import {HasLoadingState} from '../../../shared/models/has-loading-state.interface';
import {Station} from '../../../shared/models/station';

export interface StationState extends HasLoadingState {
  stations: Station[];
}
