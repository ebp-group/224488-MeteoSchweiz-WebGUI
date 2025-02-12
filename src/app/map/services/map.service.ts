import {Injectable} from '@angular/core';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import {XYZ} from 'ol/source';
import {defaults as defaultControls, ScaleLine} from 'ol/control';
import {MapConfig} from '../../shared/models/configs/map-config';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  public async createMap(target: HTMLElement, mapConfig: MapConfig): Promise<Map> {
    const backgroundLayer = new TileLayer({
      source: new XYZ({
        url: mapConfig.backgroundLayer.tileUrl,
      }),
    });

    const view = new View({
      projection: mapConfig.projection,
      center: [mapConfig.center.x, mapConfig.center.y],
      zoom: mapConfig.zoom,
    });

    return new Map({
      view,
      target,
      controls: defaultControls().extend([
        new ScaleLine({
          units: mapConfig.units,
        }),
      ]),
      layers: [backgroundLayer],
    });
  }
}
