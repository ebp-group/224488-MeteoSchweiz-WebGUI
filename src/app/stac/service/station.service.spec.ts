import {TestBed} from '@angular/core/testing';
import {provideMockStore} from '@ngrx/store/testing';
import {StacApiService} from './stac-api.service';
import {StationService} from './station.service';
import type {Station} from '../../shared/models/station';
import type {CsvStation} from '../models/csv-station';

const testCsvStation: CsvStation = {
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

const testStation: Station = {
  id: 'TEST',
  name: 'Test station',
  displayName: 'Test station (TEST)',
  coordinates: {
    longitude: 0,
    latitude: 0,
  },
};

describe('StationService', () => {
  let service: StationService;
  let stacApiService: jasmine.SpyObj<StacApiService>;

  beforeEach(() => {
    stacApiService = jasmine.createSpyObj<StacApiService>('StacApiService', ['getCollectionMetaCsvFile']);
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
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

  it('should transform csvStations to internal type representation', () => {
    // eslint-disable-next-line @typescript-eslint/dot-notation -- transformCsvStation is private. To access it we need to use property access else TypeScript complains
    const result = service['transformCsvStation'](testCsvStation);
    expect(result).toEqual(testStation);
  });

  it('should get stations for each collection and write data to store', async () => {
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
        {...testStation, id: aStation.stationAbbr, displayName: `${testStation.name} (${aStation.stationAbbr})`},
        {...testStation, id: bStation.stationAbbr, displayName: `${testStation.name} (${bStation.stationAbbr})`},
        {...testStation, id: cStation.stationAbbr, displayName: `${testStation.name} (${cStation.stationAbbr})`},
      ]),
    );
  });

  it('should merge stations with the same id for different collections', async () => {
    const collections = ['a', 'b', 'c'];

    stacApiService.getCollectionMetaCsvFile.and.resolveTo([testCsvStation]);

    const parameters = await service.loadStationsForCollections(collections);

    expect(parameters).toEqual(jasmine.arrayWithExactContents([testStation]));
  });
});
