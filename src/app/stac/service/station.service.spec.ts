import {TestBed} from '@angular/core/testing';
import {StacApiService} from './stac-api.service';
import {StationService} from './station.service';
import type {Station} from '../../shared/models/station';
import type {CsvStation} from '../models/csv-station';

const testCollection = 'collection';

const testCsvStation: CsvStation = {
  stationAbbr: 'TEST',
  stationName: 'Test station',
  stationCanton: '',
  stationWigosId: '',
  stationTypeDe: 'Stations typ',
  stationTypeFr: 'french station type',
  stationTypeIt: 'italian station type',
  stationTypeEn: 'station type',
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

const testStation: Station = {
  id: 'TEST',
  name: 'Test station',
  displayName: 'Test station (TEST)',
  coordinates: {
    longitude: 0,
    latitude: 0,
  },
  collection: testCollection,
  type: {
    en: 'station type',
    de: 'Stations typ',
    fr: 'french station type',
    it: 'italian station type',
  },
};

describe('StationService', () => {
  let service: StationService;
  let stacApiService: jasmine.SpyObj<StacApiService>;

  beforeEach(() => {
    stacApiService = jasmine.createSpyObj<StacApiService>('StacApiService', ['getCollectionMetaCsvFile']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: StacApiService,
          useValue: stacApiService,
        },
      ],
    });
    service = TestBed.inject(StationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transform a station', async () => {
    stacApiService.getCollectionMetaCsvFile.and.resolveTo([testCsvStation]);

    const parameters = await service.loadStationsForCollections([testCollection]);

    expect(parameters).toEqual(jasmine.arrayWithExactContents([testStation] satisfies Station[]));
  });

  it('should get stations for all collections', async () => {
    const collections = ['a', 'b', 'c'];
    const aStation: CsvStation = {
      ...testCsvStation,
      stationAbbr: 'test a',
    };
    const bStation: CsvStation = {
      ...testCsvStation,
      stationAbbr: 'test b',
    };
    const cStation: CsvStation = {
      ...testCsvStation,
      stationAbbr: 'test c',
    };
    stacApiService.getCollectionMetaCsvFile
      .withArgs('a', 'stations')
      .and.resolveTo([aStation])
      .withArgs('b', 'stations')
      .and.resolveTo([bStation])
      .withArgs('c', 'stations')
      .and.resolveTo([cStation]);

    const parameters = await service.loadStationsForCollections(collections);

    expect(parameters).toEqual(
      jasmine.arrayWithExactContents([
        {...testStation, id: aStation.stationAbbr, displayName: `${testStation.name} (${aStation.stationAbbr})`, collection: 'a'},
        {...testStation, id: bStation.stationAbbr, displayName: `${testStation.name} (${bStation.stationAbbr})`, collection: 'b'},
        {...testStation, id: cStation.stationAbbr, displayName: `${testStation.name} (${cStation.stationAbbr})`, collection: 'c'},
      ] satisfies Station[]),
    );
  });

  it('should not merge stations with the same id', async () => {
    const collections = ['a', 'b', 'c'];

    stacApiService.getCollectionMetaCsvFile.and.resolveTo([testCsvStation, testCsvStation]);

    const parameters = await service.loadStationsForCollections(collections);

    expect(parameters).toEqual(
      jasmine.arrayWithExactContents([
        {...testStation, collection: 'a'},
        {...testStation, collection: 'a'},
        {...testStation, collection: 'b'},
        {...testStation, collection: 'b'},
        {...testStation, collection: 'c'},
        {...testStation, collection: 'c'},
      ] satisfies Station[]),
    );
  });

  it('should not merge stations with the same ids for the same collection', async () => {
    stacApiService.getCollectionMetaCsvFile.and.resolveTo([testCsvStation, testCsvStation]);

    const parameters = await service.loadStationsForCollections([testCollection]);

    expect(parameters).toEqual(jasmine.arrayWithExactContents([testStation, testStation] satisfies Station[]));
  });
});
