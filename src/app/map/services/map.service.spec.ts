import {HttpClient, provideHttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {StyleSpecification} from '@maplibre/maplibre-gl-style-spec';
import {provideMockStore} from '@ngrx/store/testing';
import {LngLat, Map} from 'maplibre-gl';
import {of} from 'rxjs';
import {MapConfig} from '../../shared/models/configs/map-config';
import {Station} from '../../shared/models/station';
import {MapViewport} from '../models/map-viewport';
import {styleSpecificationMock} from '../testing/data/style-specification.mock';
import {MapService} from './map.service';

describe('MapService', () => {
  let service: MapService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapService, provideHttpClient(), provideMockStore()],
    });

    service = TestBed.inject(MapService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a map with the given configuration', () => {
    spyOn(service, 'removeMap');
    const target = document.createElement('div');
    const mapConfig = {
      defaultBoundingBox: {
        type: 'boundingBox',
        southWest: {longitude: 0, latitude: 0},
        northEast: {longitude: 1, latitude: 1},
      },
      enableRotation: false,
    } as MapConfig;

    service.createMap(target, mapConfig);

    // eslint-disable-next-line @typescript-eslint/dot-notation -- necessary because the map should be only available within the service
    const map = service['map'];
    expect(map).toBeDefined();
    expect(map!.getContainer()).toBe(target);
    // the following expectations are just approximations, because the bounds within the map are not exactly the same as the given ones,
    // and we only want to check if the bounds are set initially around the given values
    expect(map!.getBounds().getSouth()).toBeCloseTo(0, 0.1);
    expect(map!.getBounds().getWest()).toBeCloseTo(0, 0.1);
    expect(map!.getBounds().getEast()).toBeCloseTo(1, 0.1);
    expect(map!.getBounds().getNorth()).toBeCloseTo(1, 0.1);
    expect(service.removeMap).toHaveBeenCalledOnceWith();
  });

  describe('when the map is created', () => {
    let map: Map;

    beforeEach(() => {
      const target = document.createElement('div');
      const mapConfig = {
        defaultBoundingBox: {
          type: 'boundingBox',
          southWest: {longitude: 0, latitude: 0},
          northEast: {longitude: 1, latitude: 1},
        },
        enableRotation: false,
      } as MapConfig;
      service.createMap(target, mapConfig);

      // eslint-disable-next-line @typescript-eslint/dot-notation -- necessary because the map should be only available within the service
      map = service['map']!;
    });

    it('should initialize the map with the given viewport', async () => {
      const mapConfig = {
        styleUrl: 'style-url',
      } as MapConfig;
      const initialMapViewport: MapViewport = {
        type: 'centerAndZoom',
        center: {longitude: 0, latitude: 1},
        zoom: 2,
      };
      const httpGetSpy = spyOn(httpClient, 'get').and.returnValue(of(styleSpecificationMock));
      spyOn(map, 'setCenter');
      spyOn(map, 'setZoom');
      spyOn(map, 'once').and.returnValue(Promise.resolve());
      spyOn(map, 'on');
      const setStyleSpy = spyOn(map, 'setStyle');

      await service.initializeMap(mapConfig, initialMapViewport);

      expect(httpGetSpy).toHaveBeenCalledOnceWith('style-url');
      expect(map.setCenter).toHaveBeenCalledOnceWith(new LngLat(0, 1), {animate: false});
      expect(map.setZoom).toHaveBeenCalledOnceWith(2, {animate: false});
      expect(setStyleSpy).toHaveBeenCalledTimes(1);
      const styleSpecification = setStyleSpy.calls.first().args[0] as StyleSpecification;
      expect(styleSpecification.layers.length).toEqual(1);
      expect(styleSpecification.layers[0].id).toEqual('background');
      expect(map.on).toHaveBeenCalledWith('zoom', jasmine.any(Function));
      expect(map.on).toHaveBeenCalledWith('move', jasmine.any(Function));
    });

    it('should remove the map', () => {
      spyOn(map, 'remove');

      service.removeMap();

      expect(map.remove).toHaveBeenCalledOnceWith();
    });

    it('should add stations to the map', () => {
      const stations: Station[] = [
        {
          id: 'station-id',
          name: 'station-name',
          coordinates: {longitude: 0, latitude: 0},
        },
      ];
      spyOn(map, 'addSource');
      spyOn(map, 'addLayer');
      spyOn(map, 'getLayer').and.returnValue(undefined);
      spyOn(map, 'getSource').and.returnValue(undefined);

      service.addStationsToMap(stations);

      expect(map.addSource).toHaveBeenCalled();
      expect(map.addLayer).toHaveBeenCalledTimes(2); // circle and label layer
    });

    it('should filter stations from the map', () => {
      const stationIds: string[] = ['station-id'];
      spyOn(map, 'setFilter');

      service.filterStationsOnMap(stationIds);

      expect(map.setFilter).toHaveBeenCalledTimes(1);
    });
  });
});
