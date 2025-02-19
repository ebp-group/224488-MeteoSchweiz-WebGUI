import {Injectable} from '@angular/core';
import {CircleLayerSpecification, LayerSpecification, Map, Subscription} from 'maplibre-gl';
import {MapConfig} from '../../shared/models/configs/map-config';
import {Station} from '../../shared/models/station';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map?: Map;

  public async createMap(target: HTMLElement, mapConfig: MapConfig): Promise<Map> {
    if (this.map) {
      this.removeMap();
    }
    const map = new Map({
      container: target,
      style: mapConfig.styleUrl,
      bounds: mapConfig.boundingBox,
    });
    await this.loadStyle(map);
    this.removeUnnecessaryLayers(map);
    this.map = map;
    return map;
  }

  public removeMap(): void {
    this.map?.remove();
    this.map = undefined;
  }

  public addStationsToMap(stations: Station[]): void {
    const map = this.map;
    if (!map) {
      return;
    }
    this.removeStationsFromMap();
    map.addSource('stations', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: stations.map((station) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [station.coordinates.lng, station.coordinates.lat],
          },
          properties: {
            id: station.id,
            name: station.name,
          },
        })),
      },
    });
    map.addLayer({
      id: 'stations',
      type: 'circle',
      source: 'stations',
      paint: {
        'circle-radius': 6,
        'circle-color': '#fff',
        'circle-stroke-color': '#069',
        'circle-stroke-width': 2,
      } satisfies CircleLayerSpecification['paint'],
    });
    map.addLayer({
      id: 'stations-label',
      type: 'symbol',
      source: 'stations',
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Frutiger Neue Regular'],
        'text-size': 12,
        'text-offset': [0, 1.5],
      },
      minzoom: 8,
    });
  }

  public filterStationsOnMap(stations: Station[]): void {
    const map = this.map;
    if (!map) {
      return;
    }
    map.setFilter('stations', ['in', 'id', ...stations.map((station) => station.id)]);
  }

  private removeStationsFromMap(): void {
    const map = this.map;
    if (!map) {
      return;
    }
    if (map.getLayer('stations')) {
      map.removeLayer('stations');
    }
    if (map.getSource('stations')) {
      map.removeSource('stations');
    }
    if (map.getLayer('stations-label')) {
      map.removeLayer('stations-label');
    }
  }

  private loadStyle(map: Map): Promise<Map> {
    const subscriptions: Subscription[] = [];
    return new Promise<Map>((resolve, reject) => {
      subscriptions.push(
        map.on('load', () => {
          resolve(map);
        }),
      );
      subscriptions.push(
        map.on('error', (error) => {
          reject(error.error);
        }),
      );
    }).finally(() => subscriptions.forEach((subscription) => subscription.unsubscribe()));
  }

  private removeUnnecessaryLayers(map: Map): void {
    const layers = map.getStyle().layers;
    const layerIdsToRemove = new Set(
      [
        ...layers.filter(
          (layer: LayerSpecification) =>
            !(layer.id === 'background' || layer.id.includes('hillshade') || layer.id.includes('water') || layer.id === 'boundary'),
        ),
        ...layers.filter((layer: LayerSpecification) => layer.type === 'symbol'),
      ].map((layer: LayerSpecification) => layer.id),
    );
    layerIdsToRemove.forEach((symbolLayerId: string) => {
      map.removeLayer(symbolLayerId);
    });
  }
}
