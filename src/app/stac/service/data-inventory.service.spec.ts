import {TestBed} from '@angular/core/testing';
import {ParameterStationMapping} from '../../shared/models/parameter-station-mapping';
import {CsvDataInventory} from '../models/csv-data-inventory';
import {DataInventoryService} from './data-inventory.service';
import {ParameterService} from './parameter.service';
import {StacApiService} from './stac-api.service';
import type {CollectionAsset} from '../../shared/models/collection-assets';

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
    metaFileType: 'data-inventory',
    url: 'data-inventory://',
    collection: testCollection,
  },
];

const testCsvDataInventory: CsvDataInventory = {
  measCatNr: '0',
  ownerOrgNameTx: '',
  paramShortNameTx: 'test00d0',
  sinceDt: '',
  stationNatAbbrTx: 'TES',
  tillDt: '',
};

const testParameterStationMapping: ParameterStationMapping = {
  stationId: 'TES',
  parameterId: ParameterService.extractIdFromShortname(testCsvDataInventory.paramShortNameTx),
  collection: testCollection,
};

describe('DataInventoryService', () => {
  let service: DataInventoryService;
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
    service = TestBed.inject(DataInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get parameter station mappings for collection', async () => {
    stacApiService.fetchAndParseCsvFile.and.resolveTo([testCsvDataInventory]);

    const parameters = await service.loadParameterStationMappingsForCollections(testCollectionAssets);

    expect(parameters).toEqual(jasmine.arrayWithExactContents([testParameterStationMapping]));
  });

  it('should only load assets of meta type data-inventory', async () => {
    stacApiService.fetchAndParseCsvFile.and.resolveTo([testCsvDataInventory]);

    await service.loadParameterStationMappingsForCollections(testCollectionAssets);

    expect(stacApiService.fetchAndParseCsvFile).toHaveBeenCalledOnceWith('data-inventory://');
  });

  it('should not filter out duplicates', async () => {
    const collections = [
      testCollectionAssets.map((asset) => ({...asset, collection: 'a'})),
      testCollectionAssets.map((asset) => ({...asset, collection: 'b'})),
      testCollectionAssets.map((asset) => ({...asset, collection: 'c'})),
    ].flat();
    stacApiService.fetchAndParseCsvFile.and.resolveTo([testCsvDataInventory, testCsvDataInventory]);

    const parameters = await service.loadParameterStationMappingsForCollections(collections);

    expect(parameters).toEqual(
      jasmine.arrayWithExactContents([
        {...testParameterStationMapping, collection: 'a'},
        {...testParameterStationMapping, collection: 'a'},
        {...testParameterStationMapping, collection: 'b'},
        {...testParameterStationMapping, collection: 'b'},
        {...testParameterStationMapping, collection: 'c'},
        {...testParameterStationMapping, collection: 'c'},
      ]),
    );
  });
});
