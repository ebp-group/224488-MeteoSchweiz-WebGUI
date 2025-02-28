import {type MapConfig} from '../models/configs/map-config';

export const mapConfig = {
  styleUrl: 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.basemap.vt/style.json',
  enableRotation: false,
  defaultBoundingBox: {
    type: 'boundingBox',
    southWest: {longitude: 6.02260949059, latitude: 45.7769477403},
    northEast: {longitude: 10.4427014502, latitude: 47.8308275417},
  },
  defaultZoomAndCenter: {
    type: 'centerAndZoom',
    center: {longitude: 8.231974, latitude: 46.818187},
    zoom: 6,
  },
} as const satisfies MapConfig;
