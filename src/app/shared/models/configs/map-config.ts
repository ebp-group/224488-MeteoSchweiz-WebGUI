import {Coordinates} from '../coordinates';

export interface MapConfig {
  styleUrl: string;
  boundingBox: [Coordinates, Coordinates];
}
