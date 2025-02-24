import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {StyleSpecification} from '@maplibre/maplibre-gl-style-spec';
import {CircleLayerSpecification, LayerSpecification, LngLat, LngLatBounds, Map, SymbolLayerSpecification} from 'maplibre-gl';
import {firstValueFrom} from 'rxjs';
import {MapConfig} from '../../shared/models/configs/map-config';
import {Station} from '../../shared/models/station';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private readonly http = inject(HttpClient);

  private map?: Map;
  private readonly stationSourceId = 'stations' as const;
  private readonly stationLayerId = 'stations' as const;
  private readonly stationLabelLayerId = 'stations-label' as const;

  public async createMap(target: HTMLElement, mapConfig: MapConfig): Promise<Map> {
    this.removeMap();
    const style = await this.fetchStyle(mapConfig.styleUrl);
    style.layers = this.filterUnnecessaryLayers(style.layers);
    this.map = new Map({
      container: target,
      style,
      bounds: new LngLatBounds(
        new LngLat(mapConfig.boundingBox[0].longitude, mapConfig.boundingBox[0].latitude),
        new LngLat(mapConfig.boundingBox[1].longitude, mapConfig.boundingBox[1].latitude),
      ),
      dragRotate: mapConfig.enableRotation,
    });
    // TODO: Either make sure sure that the filters are applied to the map
    //       or to change the `map` member into a BehaviorSubject and apply the filter
    //       as soon as it is not `undefined` anymore.
    return this.map;
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
    map.addSource(this.stationSourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: stations.map((station) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [station.coordinates.longitude, station.coordinates.latitude],
          },
          properties: {
            id: station.id,
            name: station.name,
          } satisfies Partial<Station>,
        })),
      },
    });
    map.addLayer({
      id: this.stationLayerId,
      type: 'circle',
      source: this.stationSourceId,
      paint: {
        'circle-radius': 6,
        'circle-color': '#fff',
        'circle-stroke-color': '#069',
        'circle-stroke-width': 2,
      },
    } satisfies CircleLayerSpecification);
    map.addLayer({
      id: this.stationLabelLayerId,
      type: 'symbol',
      source: this.stationSourceId,
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Frutiger Neue Regular'],
        'text-size': 12,
        'text-offset': [0, 1.5],
      },
      minzoom: 8,
    } satisfies SymbolLayerSpecification);
  }

  public filterStationsOnMap(stations: Station[]): void {
    const map = this.map;
    if (!map) {
      return;
    }
    map.setFilter(this.stationSourceId, ['in', 'id', ...stations.map((station) => station.id)]);
  }

  private async fetchStyle(styleUrl: string): Promise<StyleSpecification> {
    return firstValueFrom(this.http.get<StyleSpecification>(styleUrl));
  }

  private removeStationsFromMap(): void {
    const map = this.map;
    if (!map) {
      return;
    }
    if (map.getLayer(this.stationLayerId)) {
      map.removeLayer(this.stationLayerId);
    }
    if (map.getLayer(this.stationLabelLayerId)) {
      map.removeLayer(this.stationLabelLayerId);
    }
    if (map.getSource(this.stationSourceId)) {
      map.removeSource(this.stationSourceId);
    }
  }

  private filterUnnecessaryLayers(layers: LayerSpecification[]): LayerSpecification[] {
    return layers
      .filter(
        (layer) => layer.id === 'background' || layer.id.includes('hillshade') || layer.id.includes('water') || layer.id === 'boundary',
      )
      .filter((layer) => layer.type !== 'symbol');
  }
}
