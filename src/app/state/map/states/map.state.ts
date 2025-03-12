import {Coordinates} from '../../../shared/models/coordinates';
import {LoadableState} from '../../../shared/models/loadable-state';

export interface MapState extends LoadableState {
  areLayersInitialized: boolean;
  zoom: number | undefined;
  center: Coordinates | undefined;
}
