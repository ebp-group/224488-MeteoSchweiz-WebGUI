import {TestBed} from '@angular/core/testing';
import {CsvParameter} from '../models/csv-parameter';
import {ParameterService} from './parameter.service';
import {StacApiService} from './stac-api.service';
import type {CollectionAsset} from '../../shared/models/collection-assets';
import type {Parameter} from '../../shared/models/parameter';

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

const testCsvParameter: CsvParameter = {
  parameterDatatype: 'Float',
  parameterDecimals: '1',
  parameterDescriptionDe: 'Ein Text',
  parameterDescriptionEn: 'Some text',
  parameterDescriptionFr: 'Some text but french',
  parameterDescriptionIt: 'Some text but Italian',
  parameterGranularity: 'D',
  parameterGroupDe: 'Wind',
  parameterGroupEn: 'wind',
  parameterGroupFr: 'vent',
  parameterGroupIt: 'vento',
  parameterShortname: 'test00d0',
  parameterUnit: 'm/s',
};

const testParameter: Parameter = {
  // Last two characters define type of parameter and should thus not be part of id
  id: 'test00',
  group: {
    de: 'Wind',
    en: 'Wind',
    fr: 'Vent',
    it: 'Vento',
  },
};

describe('ParameterService', () => {
  let service: ParameterService;
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
    service = TestBed.inject(ParameterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should extract ids from shortnames correctly', () => {
    const result = ParameterService.extractIdFromShortname(testCsvParameter.parameterShortname);
    expect(result).toBe(testParameter.id);
  });

  it('should extract ids from group name correctly', () => {
    const result = ParameterService.extractGroupIdFromGroupName(testParameter.group);
    expect(result).toBe(testParameter.group.en);
  });

  describe('loadParameterForCollections', () => {
    it('should only load assets of meta type parameter', async () => {
      stacApiService.fetchAndParseCsvFile.and.resolveTo([testCsvParameter]);

      await service.loadParameterForCollections(testCollectionAssets);

      expect(stacApiService.fetchAndParseCsvFile).toHaveBeenCalledOnceWith('parameter://');
    });

    it('should get parameters for each collection and merge parameters with the same id', async () => {
      const collections = [
        testCollectionAssets.map((asset) => ({...asset, collection: 'a'})),
        testCollectionAssets.map((asset) => ({...asset, collection: 'b'})),
        testCollectionAssets.map((asset) => ({...asset, collection: 'c'})),
      ].flat();

      stacApiService.fetchAndParseCsvFile.and.resolveTo([testCsvParameter]);

      const parameters = await service.loadParameterForCollections(collections);

      expect(parameters).toEqual(jasmine.arrayWithExactContents([testParameter]));
    });

    it('should get stations for each collection and not merge different ids', async () => {
      const collectionAssetA = testCollectionAssets.map((asset) => ({...asset, collection: 'a', url: 'parameter://a'}));
      const collectionAssetB = testCollectionAssets.map((asset) => ({...asset, collection: 'b', url: 'parameter://b'}));
      const collectionAssetC = testCollectionAssets.map((asset) => ({...asset, collection: 'c', url: 'parameter://c'}));
      const collections = collectionAssetA.concat(collectionAssetB).concat(collectionAssetC);
      const aParameter: CsvParameter = {...testCsvParameter, parameterShortname: 'test0ad0'};
      const aParameterId = ParameterService.extractIdFromShortname(aParameter.parameterShortname);
      const bParameter: CsvParameter = {...testCsvParameter, parameterShortname: 'test0bd0'};
      const bParameterId = ParameterService.extractIdFromShortname(bParameter.parameterShortname);
      const cParameter: CsvParameter = {...testCsvParameter, parameterShortname: 'test0cd0'};
      const cParameterId = ParameterService.extractIdFromShortname(cParameter.parameterShortname);
      stacApiService.fetchAndParseCsvFile
        .withArgs('parameter://a')
        .and.resolveTo([aParameter])
        .withArgs('parameter://b')
        .and.resolveTo([bParameter])
        .withArgs('parameter://c')
        .and.resolveTo([cParameter]);

      const parameters = await service.loadParameterForCollections(collections);

      expect(parameters).toEqual(
        jasmine.arrayWithExactContents([
          {...testParameter, id: aParameterId},
          {...testParameter, id: bParameterId},
          {...testParameter, id: cParameterId},
        ]),
      );
    });

    it('should not merge parameters with different ids', async () => {
      const aParameter: CsvParameter = {...testCsvParameter, parameterShortname: 'test0ad0'};
      const aParameterId = ParameterService.extractIdFromShortname(aParameter.parameterShortname);
      const bParameter: CsvParameter = {...testCsvParameter, parameterShortname: 'test0bd0'};
      const bParameterId = ParameterService.extractIdFromShortname(bParameter.parameterShortname);
      stacApiService.fetchAndParseCsvFile.and.resolveTo([aParameter, bParameter]);

      const parameters = await service.loadParameterForCollections(testCollectionAssets);

      expect(parameters).toEqual(
        jasmine.arrayWithExactContents([
          {...testParameter, id: aParameterId},
          {...testParameter, id: bParameterId},
        ]),
      );
    });

    it('should merge parameters with the same shortname or shortnames with the same prefix for the same collection', async () => {
      const a1Parameter: CsvParameter = {...testCsvParameter, parameterShortname: 'test0ad0'};
      const aParameterId = ParameterService.extractIdFromShortname(a1Parameter.parameterShortname);
      const a2Parameter: CsvParameter = {...testCsvParameter, parameterShortname: 'test0ax0'};
      stacApiService.fetchAndParseCsvFile.and.resolveTo([testCsvParameter, testCsvParameter, a1Parameter, a2Parameter]);

      const parameters = await service.loadParameterForCollections(testCollectionAssets);

      expect(parameters).toEqual(jasmine.arrayWithExactContents([{...testParameter}, {...testParameter, id: aParameterId}]));
    });
  });
});
