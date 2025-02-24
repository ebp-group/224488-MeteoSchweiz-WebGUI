import {type MapConfig} from '../models/configs/map-config';

export const mapConfig = {
  styleUrl: 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.basemap.vt/style.json',
  boundingBox: [
    {longitude: 6.02260949059, latitude: 45.7769477403},
    {longitude: 10.4427014502, latitude: 47.8308275417},
  ],
  enableRotation: false,
} as const satisfies MapConfig;
