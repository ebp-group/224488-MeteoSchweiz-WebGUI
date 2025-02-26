import {Coordinates} from '../../shared/models/coordinates';

interface MapViewportBase {
  type: 'boundingBox' | 'centerAndZoom';
}

export interface BoundingBox extends MapViewportBase {
  type: 'boundingBox';
  northEast: Coordinates;
  southWest: Coordinates;
}

export interface CenterAndZoom extends MapViewportBase {
  type: 'centerAndZoom';
  center: Coordinates;
  zoom: number;
}

export type MapViewport = BoundingBox | CenterAndZoom;
