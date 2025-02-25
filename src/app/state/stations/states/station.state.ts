import {LoadableState} from '../../../shared/models/loadable-state';
import {Station} from '../../../shared/models/station';

export interface StationState extends LoadableState {
  stations: Station[];
}
