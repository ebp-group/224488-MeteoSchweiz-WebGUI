import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {StyleSpecification} from '@maplibre/maplibre-gl-style-spec';
import {Store} from '@ngrx/store';
import {CircleLayerSpecification, LayerSpecification, LngLat, LngLatBounds, Map, MapOptions, SymbolLayerSpecification} from 'maplibre-gl';
import {firstValueFrom, Subscription} from 'rxjs';
import {MapNotInitializedError} from '../../shared/errors/map.error';
import {MapConfig} from '../../shared/models/configs/map-config';
import {Coordinates} from '../../shared/models/coordinates';
import {Station} from '../../shared/models/station';
import {mapActions} from '../../state/map/actions/map.action';
import {MapViewport} from '../models/map-viewport';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(Store);

  private map?: Map;
  private mapSubscriptions?: Subscription;
  private readonly stationSourceId = 'stations' as const;
  private readonly stationLayerId = 'stations' as const;
  private readonly stationLabelLayerId = 'stations-label' as const;

  public createMap(target: HTMLElement, mapConfig: MapConfig): void {
    this.removeMap();
    const mapOptions: MapOptions = {
      container: target,
      dragRotate: mapConfig.enableRotation,
      bounds: new LngLatBounds(
        new LngLat(mapConfig.defaultBoundingBox.southWest.longitude, mapConfig.defaultBoundingBox.southWest.latitude),
        new LngLat(mapConfig.defaultBoundingBox.northEast.longitude, mapConfig.defaultBoundingBox.northEast.latitude),
      ),
    };
    this.map = new Map(mapOptions);
  }

  public async initializeMap(mapConfig: MapConfig, initialMapViewport: MapViewport): Promise<void> {
    const map = this.map;
    if (!map) {
      throw new MapNotInitializedError();
    }

    switch (initialMapViewport.type) {
      case 'boundingBox': {
        map.fitBounds(
          new LngLatBounds(
            new LngLat(initialMapViewport.southWest.longitude, initialMapViewport.southWest.latitude),
            new LngLat(initialMapViewport.northEast.longitude, initialMapViewport.northEast.latitude),
          ),
          {animate: false},
        );
        break;
      }
      case 'centerAndZoom': {
        map.setCenter(new LngLat(initialMapViewport.center.longitude, initialMapViewport.center.latitude), {animate: false});
        map.setZoom(initialMapViewport.zoom, {animate: false});
        break;
      }
    }
    const style = await this.fetchStyle(mapConfig.styleUrl);
    style.layers = this.filterUnnecessaryLayers(style.layers);
    map.setStyle(style);
    await map.once('load');
    this.subscribeToMapEvents();
  }

  public removeMap(): void {
    this.mapSubscriptions?.unsubscribe();
    this.mapSubscriptions = undefined;
    this.map?.remove();
    this.map = undefined;
  }

  public createInitialMapViewport(zoom: number | undefined, center: Coordinates | undefined, mapConfig: MapConfig): MapViewport {
    return center || zoom
      ? {
          type: 'centerAndZoom',
          center: center ?? mapConfig.defaultZoomAndCenter.center,
          zoom: zoom ?? mapConfig.defaultZoomAndCenter.zoom,
        }
      : mapConfig.defaultBoundingBox;
  }

  public addStationsToMap(stations: Station[]): void {
    const map = this.map;
    if (!map) {
      throw new MapNotInitializedError();
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

  public filterStationsOnMap(stationIds: string[]): void {
    const map = this.map;
    if (!map) {
      throw new MapNotInitializedError();
    }
    map.setFilter(this.stationSourceId, ['in', 'id', ...stationIds]);
  }

  private subscribeToMapEvents(): void {
    const map = this.map;
    if (!map) {
      throw new MapNotInitializedError();
    }
    if (this.mapSubscriptions) {
      this.mapSubscriptions.unsubscribe();
    }
    this.mapSubscriptions = new Subscription();
    this.mapSubscriptions.add(map.on('zoom', () => this.dispatchZoomChanges(map.getZoom())));
    this.mapSubscriptions.add(map.on('move', () => this.dispatchCenterChanges(map.getCenter())));
  }

  private dispatchZoomChanges(zoom: number): void {
    this.store.dispatch(mapActions.setZoom({zoom}));
  }

  private dispatchCenterChanges(center: LngLat): void {
    this.store.dispatch(mapActions.setCenter({center: {latitude: center.lat, longitude: center.lng}}));
  }

  private async fetchStyle(styleUrl: string): Promise<StyleSpecification> {
    return firstValueFrom(this.http.get<StyleSpecification>(styleUrl));
  }

  private removeStationsFromMap(): void {
    const map = this.map;
    if (!map) {
      throw new MapNotInitializedError();
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
