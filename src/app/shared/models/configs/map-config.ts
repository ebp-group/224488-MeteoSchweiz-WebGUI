import {BoundingBox, CenterAndZoom} from '../../../map/models/map-viewport';

export interface MapConfig {
  styleUrl: string;
  enableRotation: boolean;
  defaultBoundingBox: BoundingBox;
  defaultZoomAndCenter: CenterAndZoom;
  minZoom: number;
}
