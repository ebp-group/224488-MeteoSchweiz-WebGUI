import {HttpClient, provideHttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {Map} from 'maplibre-gl';
import {of} from 'rxjs';
import {styleSpecificationMock} from '../../../testing/data/style-specification.mock';
import {MapConfig} from '../../shared/models/configs/map-config';
import {MapService} from './map.service';

describe('MapService', () => {
  let service: MapService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapService, provideHttpClient()],
    });

    service = TestBed.inject(MapService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a map with the given configuration', async () => {
    const target = document.createElement('div');
    const httpGetSpy = spyOn(httpClient, 'get').and.returnValue(of(styleSpecificationMock));
    const mapConfig: MapConfig = {
      styleUrl: 'map-style-url',
      boundingBox: [
        {lng: 0, lat: 0},
        {lng: 1, lat: 1},
      ],
      enableRotation: true,
    };

    const map = await service.createMap(target, mapConfig);

    expect(map).toBeDefined();
    expect(map.getContainer()).toBe(target);
    expect(httpGetSpy).toHaveBeenCalledOnceWith('map-style-url');
  });

  // TODO: this is disabled until we finalize the implementation of the custom styling.
  xit('should create a map where layers have been filtered', async () => {
    const target = document.createElement('div');
    spyOn(httpClient, 'get').and.returnValue(of(styleSpecificationMock));
    const mapConfig: MapConfig = {
      styleUrl: 'map-style-url',
      boundingBox: [
        {lng: 0, lat: 0},
        {lng: 1, lat: 1},
      ],
      enableRotation: true,
    };

    const map = await service.createMap(target, mapConfig);

    expect(map.getStyle()).toBeDefined();
    expect(map.getStyle().layers.length).toEqual(1);
    expect(map.getStyle().layers[0].id).toEqual('background');
  });

  describe('when the map is created', () => {
    let map: Map;

    beforeEach(async () => {
      const target = document.createElement('div');
      spyOn(httpClient, 'get').and.returnValue(of(styleSpecificationMock));
      const mapConfig: MapConfig = {
        styleUrl: 'map-style-url',
        boundingBox: [
          {lng: 0, lat: 0},
          {lng: 1, lat: 1},
        ],
        enableRotation: true,
      };
      map = await service.createMap(target, mapConfig);
    });

    it('should remove the map', () => {
      const mapRemoveSpy = spyOn(map, 'remove');

      service.removeMap();

      expect(mapRemoveSpy).toHaveBeenCalled();
    });

    it('should add stations to the map', () => {
      const stations = [
        {
          id: 'station-id',
          name: 'station-name',
          coordinates: {lng: 0, lat: 0},
        },
      ];
      const mapAddSourceSpy = spyOn(map, 'addSource');
      const mapAddLayerSpy = spyOn(map, 'addLayer');

      service.addStationsToMap(stations);

      expect(mapAddSourceSpy).toHaveBeenCalled();
      expect(mapAddLayerSpy).toHaveBeenCalledTimes(2); // circle and label layer
    });

    it('should filter stations from the map', () => {
      const stations = [
        {
          id: 'station-id',
          name: 'station-name',
          coordinates: {lng: 0, lat: 0},
        },
      ];
      const mapFilterSpy = spyOn(map, 'setFilter');

      service.filterStationsOnMap(stations);

      expect(mapFilterSpy).toHaveBeenCalled();
    });
  });
});
