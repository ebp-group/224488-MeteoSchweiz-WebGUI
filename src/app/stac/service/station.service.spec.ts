import {TestBed} from '@angular/core/testing';
import {StacApiService} from './stac-api.service';
import {StationService} from './station.service';
import type {CollectionAsset} from '../../shared/models/collection-assets';
import type {Station} from '../../shared/models/station';
import type {CsvStation} from '../models/csv-station';

const testCollection = 'collection';
const testCollectionAssets: CollectionAsset[] = [
  {
    filename: 'stations.csv',
    metaFileType: 'station',
    url: 'station://',
    collection: testCollection,
  },
  {
    filename: 'parameters.csv',
    metaFileType: 'parameter',
    url: 'parameter://',
    collection: testCollection,
  },
  {
    filename: 'datainventory.csv',
    metaFileType: 'dataInventory',
    url: 'data-inventory://',
    collection: testCollection,
  },
];

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
  stationHeightMasl: '1',
  stationHeightBarometerMasl: '',
  stationCoordinatesLv95East: '0',
  stationCoordinatesLv95North: '0',
  stationCoordinatesWgs84Lat: '2',
  stationCoordinatesWgs84Lon: '3',
  stationExpositionDe: '',
  stationExpositionFr: '',
  stationExpositionIt: '',
  stationExpositionEn: '',
  stationUrlDe: 'URL DE',
  stationUrlFr: 'URL FR',
  stationUrlIt: 'URL IT',
  stationUrlEn: 'URL EN',
};

const testStation: Station = {
  id: 'TEST',
  name: 'Test station',
  displayName: 'Test station (TEST)',
  coordinates: {
    longitude: 3,
    latitude: 2,
  },
  collection: testCollection,
  type: {
    en: 'station type',
    de: 'Stations typ',
    fr: 'french station type',
    it: 'italian station type',
  },
  elevation: 1,
  url: {
    en: 'URL EN',
    de: 'URL DE',
    fr: 'URL FR',
    it: 'URL IT',
  },
};

describe('StationService', () => {
  let service: StationService;
  let stacApiService: jasmine.SpyObj<StacApiService>;

  beforeEach(() => {
    stacApiService = jasmine.createSpyObj<StacApiService>('StacApiService', ['fetchAndParseCsvFile']);
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
    stacApiService.fetchAndParseCsvFile.and.resolveTo([testCsvStation]);

    const parameters = await service.loadStationsForCollections(testCollectionAssets);

    expect(parameters).toEqual(jasmine.arrayWithExactContents([testStation] satisfies Station[]));
  });

  it('should only load assets of meta type station', async () => {
    stacApiService.fetchAndParseCsvFile.and.resolveTo([testCsvStation]);

    await service.loadStationsForCollections(testCollectionAssets);

    expect(stacApiService.fetchAndParseCsvFile).toHaveBeenCalledOnceWith('station://');
  });

  it('should get stations for all collections', async () => {
    const collectionAssetA = testCollectionAssets.map((asset) => ({...asset, collection: 'a', url: 'station://a'}));
    const collectionAssetB = testCollectionAssets.map((asset) => ({...asset, collection: 'b', url: 'station://b'}));
    const collectionAssetC = testCollectionAssets.map((asset) => ({...asset, collection: 'c', url: 'station://c'}));
    const collections = collectionAssetA.concat(collectionAssetB).concat(collectionAssetC);
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
    stacApiService.fetchAndParseCsvFile
      .withArgs('station://a')
      .and.resolveTo([aStation])
      .withArgs('station://b')
      .and.resolveTo([bStation])
      .withArgs('station://c')
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
    const collectionAssetA = testCollectionAssets.map((asset) => ({...asset, collection: 'a', url: 'station://a'}));
    const collectionAssetB = testCollectionAssets.map((asset) => ({...asset, collection: 'b', url: 'station://b'}));
    const collectionAssetC = testCollectionAssets.map((asset) => ({...asset, collection: 'c', url: 'station://c'}));
    const collections = collectionAssetA.concat(collectionAssetB).concat(collectionAssetC);

    stacApiService.fetchAndParseCsvFile.and.resolveTo([testCsvStation, testCsvStation]);

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
    stacApiService.fetchAndParseCsvFile.and.resolveTo([testCsvStation, testCsvStation]);

    const parameters = await service.loadStationsForCollections(testCollectionAssets);

    expect(parameters).toEqual(jasmine.arrayWithExactContents([testStation, testStation] satisfies Station[]));
  });
});
