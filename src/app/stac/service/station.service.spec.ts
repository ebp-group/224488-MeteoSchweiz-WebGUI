import {TestBed} from '@angular/core/testing';
import {provideMockStore} from '@ngrx/store/testing';
import {StationService} from './station.service';
import type {Station} from '../../shared/models/station';
import type {CsvStation} from './station.service';

describe('StationService', () => {
  let service: StationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    service = TestBed.inject(StationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transform csvStations to internal type representation', () => {
    const testValue: CsvStation = {
      stationAbbr: 'TEST',
      stationName: 'Test station',
      stationCanton: '',
      stationWigosId: '',
      stationTypeDe: '',
      stationTypeFr: '',
      stationTypeIt: '',
      stationTypeEn: '',
      stationDataowner: '',
      stationDataSince: '',
      stationHeightMasl: '',
      stationHeightBarometerMasl: '',
      stationCoordinatesLv95East: '0',
      stationCoordinatesLv95North: '0',
      stationCoordinatesWgs84Lat: '0',
      stationCoordinatesWgs84Lon: '0',
      stationExpositionDe: '',
      stationExpositionFr: '',
      stationExpositionIt: '',
      stationExpositionEn: '',
      stationUrlDe: '',
      stationUrlFr: '',
      stationUrlIt: '',
      stationUrlEn: '',
    };
    const result = service.transformCsvStation(testValue);
    expect(result).toEqual({
      id: 'TEST',
      name: 'Test station',
    } satisfies Station);
  });

  it('should get stations for each collection and write data to store', async () => {
    const collections = ['a', 'b', 'c'];
    const aStation: Station = {
      id: 'test a',
      name: 'Test station a',
    };
    const bStation: Station = {
      id: 'test b',
      name: 'Test station b',
    };
    const cStation: Station = {
      id: 'test c',
      name: 'Test station c',
    };
    spyOn(service, 'getStationForCollection')
      .withArgs('a')
      .and.resolveTo([aStation])
      .withArgs('b')
      .and.resolveTo([bStation])
      .withArgs('c')
      .and.resolveTo([cStation]);

    const parameters = await service.loadStationsForCollections(collections);

    expect(parameters).toEqual(jasmine.arrayWithExactContents([aStation, bStation, cStation]));
  });

  it('should merge stations with the same id for different collections', async () => {
    const collections = ['a', 'b', 'c'];
    const aStation: Station = {
      id: 'test',
      name: 'Test station',
    };
    spyOn(service, 'getStationForCollection').and.resolveTo([aStation]);

    const parameters = await service.loadStationsForCollections(collections);

    expect(parameters).toEqual(jasmine.arrayWithExactContents([aStation]));
  });
});
