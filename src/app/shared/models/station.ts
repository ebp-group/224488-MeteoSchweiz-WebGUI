import {Coordinates} from './coordinates';

export interface Station {
  id: string;
  name: string;
  displayName: string;
  coordinates: Coordinates;
}
