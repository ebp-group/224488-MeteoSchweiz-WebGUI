import {TestBed} from '@angular/core/testing';
import {provideMockStore} from '@ngrx/store/testing';
import {CsvParameter} from '../models/csv-parameter';
import {ParameterService} from './parameter.service';
import {StacApiService} from './stac-api.service';
import type {Parameter} from '../../shared/models/parameter';

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
  description: {
    de: 'Ein Text',
    en: 'Some text',
    fr: 'Some text but french',
    it: 'Some text but Italian',
  },
  group: {
    de: 'Wind',
    en: 'wind',
    fr: 'vent',
    it: 'vento',
  },
};

describe('ParameterService', () => {
  let service: ParameterService;
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
    service = TestBed.inject(ParameterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transform csvParameters to internal Type', () => {
    // eslint-disable-next-line @typescript-eslint/dot-notation -- transformCsvParameter is private. To access it we need to use property access else TypeScript complains
    const result: Parameter = service['transformCsvParameter'](testCsvParameter);
    expect(result).toEqual(testParameter);
  });

  it('should get parameters for each collection and write data to store', async () => {
    const collections = ['a', 'b', 'c'];

    stacApiService.getCollectionMetaCsvFile.and.resolveTo([testCsvParameter]);

    const parameters = await service.loadParameterForCollections(collections);

    expect(parameters).toEqual(jasmine.arrayWithExactContents([testParameter, testParameter, testParameter]));
  });
});
