import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {provideMockStore} from '@ngrx/store/testing';
import {parameterActions} from '../../state/parameters/actions/parameter.action';
import {CsvParameter, ParameterService} from './parameter.service';
import type {Parameter} from '../../shared/models/parameter';

describe('ParameterService', () => {
  let service: ParameterService;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    service = TestBed.inject(ParameterService);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transform csvParameters to internal Type', () => {
    const testValue: CsvParameter = {
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
    const result: Parameter = service.transformCsvParameter(testValue);
    expect(result).toEqual({
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
    } satisfies Parameter);
  });

  it('should get parameters for each collection and write data to store', async () => {
    const collections = ['a', 'b', 'c'];
    const aParameter: Parameter = {
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
    spyOn(service, 'getParametersForCollection').and.returnValue(new Promise((resolve) => resolve([aParameter])));
    spyOn(store, 'dispatch');

    await service.loadParameterForCollections(collections);

    expect(store.dispatch).toHaveBeenCalledWith(parameterActions.setLoadedParameters({parameters: [aParameter, aParameter, aParameter]}));
  });
});
