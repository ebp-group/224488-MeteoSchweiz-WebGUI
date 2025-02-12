import {type MapConfig} from '../models/configs/map-config';

export const mapConfig: MapConfig = {
  projection: 'EPSG:3857',
  center: {
    x: 900000,
    y: 5900000,
  },
  zoom: 7,
  units: 'metric',
  backgroundLayer: {
    tileUrl: 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg',
  },
} as const;
