import {type MapConfig} from '../models/configs/map-config';

export const mapConfig: MapConfig = {
  styleUrl: 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.basemap.vt/style.json',
  boundingBox: [
    {lng: 6.02260949059, lat: 45.7769477403},
    {lng: 10.4427014502, lat: 47.8308275417},
  ],
} as const;
