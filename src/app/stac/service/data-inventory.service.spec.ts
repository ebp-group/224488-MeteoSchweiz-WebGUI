import {TestBed} from '@angular/core/testing';
import {provideMockStore} from '@ngrx/store/testing';
import {ParameterStationMapping} from '../../shared/models/parameter-station-mapping';
import {CsvDataInventory} from '../models/csv-data-inventory';
import {DataInventoryService} from './data-inventory.service';
import {ParameterService} from './parameter.service';
import {StacApiService} from './stac-api.service';

const testCollection = 'collection';

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
    service = TestBed.inject(DataInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get parameter station mappings for collection', async () => {
    stacApiService.getCollectionMetaCsvFile.and.resolveTo([testCsvDataInventory]);

    const parameters = await service.loadParameterStationMappingsForCollections([testCollection]);

    expect(parameters).toEqual(jasmine.arrayWithExactContents([testParameterStationMapping]));
  });

  it('should not filter out duplicates', async () => {
    const collections = ['a', 'b', 'c'];
    stacApiService.getCollectionMetaCsvFile.and.resolveTo([testCsvDataInventory, testCsvDataInventory]);

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
