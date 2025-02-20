import {StyleSpecification} from '@maplibre/maplibre-gl-style-spec';

export const styleSpecificationMock: StyleSpecification = {
  version: 8,
  name: 'basemap_v1.18.0',
  sources: {
    'relief_v1.0.0': {
      url: 'https://vectortiles.geo.admin.ch/tiles/ch.swisstopo.relief.vt/v1.0.0/tiles.json',
      type: 'vector',
    },
    'base_v1.0.0': {
      url: 'https://vectortiles.geo.admin.ch/tiles/ch.swisstopo.base.vt/v1.0.0/tiles.json',
      type: 'vector',
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      layout: {
        visibility: 'visible',
      },
      paint: {
        'background-color': 'rgb(253, 253, 254)',
      },
    },
    {
      id: 'boundary_label_l',
      type: 'symbol',
      source: 'base_v1.0.0',
      minzoom: 13.0,
      layout: {
        'text-font': ['Frutiger Neue Condensed Regular'],
        'text-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          14,
          ['match', ['get', 'admin_level'], [2, 4], 11, 10],
          18,
          ['match', ['get', 'admin_level'], [2, 4], 14, 12],
        ],
        'text-field': ['match', ['get', 'admin_level'], 2, ['get', 'adm2_l'], 4, ['get', 'adm4_l'], [6, 8], ['get', 'adm8_l'], ''],
        visibility: 'visible',
        'text-offset': [0, 0.8],
        'text-justify': 'center',
        'text-padding': 0.01,
        'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 13, 200, 18, 400],
        'text-max-angle': 30,
        'text-transform': ['match', ['get', 'admin_level'], [2, 4], 'uppercase', 'none'],
        'symbol-placement': 'line',
        'icon-keep-upright': false,
        'text-keep-upright': true,
        'text-allow-overlap': false,
        'text-letter-spacing': 0.3,
        'text-pitch-alignment': 'auto',
        'text-ignore-placement': true,
        'text-rotation-alignment': 'auto',
      },
      paint: {
        'text-color': 'rgb(195, 85, 146)',
        'text-opacity': ['step', ['zoom'], ['match', ['get', 'admin_level'], [2, 4], 1, 0], 15, 1],
        'text-halo-blur': 0.25,
        'text-halo-color': 'rgb(242, 242, 242)',
        'text-halo-width': 0.5,
        'text-translate-anchor': 'viewport',
      },
      filter: ['in', 'admin_level', 2, 4, 6, 8],
    },
  ],
  metadata: {},
  glyphs: 'https://vectortiles.geo.admin.ch/fonts/{fontstack}/{range}.pbf',
  sprite: 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.basemap.vt/sprite/sprite',
  bearing: 0.0,
  pitch: 0.0,
  center: [7.458556880930587, 46.959770261045776],
  zoom: 14.757125212752644,
  transition: {},
};
