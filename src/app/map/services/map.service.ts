import {Injectable} from '@angular/core';
import {LayerSpecification, Map} from 'maplibre-gl';
import {MapConfig} from '../../shared/models/configs/map-config';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  public async createMap(target: HTMLElement, mapConfig: MapConfig): Promise<Map> {
    const map = new Map({
      container: target,
      style: mapConfig.styleUrl,
    });
    map.fitBounds(mapConfig.boundingBox, {animate: false});
    await this.loadStyle(map);
    this.removeUnnecessaryLayers(map);
    return map;
  }

  private loadStyle(map: Map): Promise<Map> {
    return new Promise((resolve, reject) => {
      map.on('load', () => {
        resolve(map);
      });
      map.on('error', (error) => {
        reject(error.error as Error);
      });
    });
  }

  private removeUnnecessaryLayers(map: Map): void {
    const layerIdsToRemove = map
      .getStyle()
      .layers?.filter(
        (layer: LayerSpecification) =>
          !(layer.id === 'background' || layer.id.includes('hillshade') || layer.id.includes('water') || layer.id === 'boundary'),
      )
      .map((layer: LayerSpecification) => layer.id);
    layerIdsToRemove?.forEach((symbolLayerId: string) => {
      map.removeLayer(symbolLayerId);
    });
  }
}
