import {Projection} from '../projection.types';
import {Coordinates} from '../coordinates';
import {Unit} from '../unit.types';

export interface MapConfig {
  projection: Projection;
  center: Coordinates;
  zoom: number;
  units: Unit;
  backgroundLayer: WmtsLayerConfig;
}

interface WmtsLayerConfig {
  tileUrl: string;
}
