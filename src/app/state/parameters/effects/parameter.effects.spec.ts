import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {catchError, EMPTY, Observable, of} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {ParameterError} from '../../../shared/errors/parameter.error';
import {OpendataExplorerRuntimeErrorTestUtil} from '../../../shared/testing/utils/opendata-explorer-runtime-error-test.util';
import {ParameterService} from '../../../stac/service/parameter.service';
import {collectionActions} from '../../collection/actions/collection.action';
import {parameterActions} from '../actions/parameter.action';
import {selectCurrentParameterState} from '../selectors/parameter.selector';
import {failLoadingCollectionParameters, loadCollectionParameters, loadParameters} from './parameter.effects';

describe('ParameterEffects', () => {
  const measurementDataType = collectionConfig.defaultMeasurementDataType;

  let actions$: Observable<Action>;
  let store: MockStore;
  let parameterService: ParameterService;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    store = TestBed.inject(MockStore);
    parameterService = TestBed.inject(ParameterService);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should dispatch loadParameter action when loadCollection is dispatched', (done: DoneFn) => {
    const collections = ['collection'];
    actions$ = of(collectionActions.loadCollections({collections, measurementDataType}));
    loadCollectionParameters(actions$).subscribe((action) => {
      expect(action).toEqual(parameterActions.loadParametersForCollections({collections, measurementDataType}));
      done();
    });
  });

  it('should dispatch the SetParameter action when loading parameters for collections', (done: DoneFn) => {
    spyOn(parameterService, 'loadParameterForCollections').and.resolveTo([]);
    store.overrideSelector(selectCurrentParameterState, {parameters: [], loadingState: undefined});
    actions$ = of(parameterActions.loadParametersForCollections({collections: ['collection'], measurementDataType}));

    loadParameters(actions$, store, parameterService).subscribe((action) => {
      expect(action).toEqual(parameterActions.setLoadedParameters({parameters: [], measurementDataType}));
      done();
    });
  });

  it('should not call the service if the data is already loaded', (done: DoneFn) => {
    spyOn(parameterService, 'loadParameterForCollections');
    store.overrideSelector(selectCurrentParameterState, {parameters: [], loadingState: 'loaded'});
    actions$ = of(parameterActions.loadParametersForCollections({collections: ['collection'], measurementDataType}));

    loadParameters(actions$, store, parameterService).subscribe({
      complete: () => {
        expect(parameterService.loadParameterForCollections).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should throw a Parameter error after dispatching setParameterLoadingError', (done: DoneFn) => {
    const error = new Error('My cabbages!!!');
    const expectedError = new ParameterError(error);

    actions$ = of(parameterActions.setParameterLoadingError({error, measurementDataType}));
    failLoadingCollectionParameters(actions$)
      .pipe(
        catchError((caughtError: unknown) => {
          OpendataExplorerRuntimeErrorTestUtil.expectToDeepEqual(caughtError, expectedError);
          done();
          return EMPTY;
        }),
      )
      .subscribe();
  });

  it('should set loading error if the service throws an error', (done: DoneFn) => {
    const error = new Error('test');
    spyOn(parameterService, 'loadParameterForCollections').and.rejectWith(error);
    store.overrideSelector(selectCurrentParameterState, {parameters: [], loadingState: undefined});
    actions$ = of(parameterActions.loadParametersForCollections({collections: ['collection'], measurementDataType}));

    loadParameters(actions$, store, parameterService).subscribe((action) => {
      expect(action).toEqual(parameterActions.setParameterLoadingError({error, measurementDataType}));
      done();
    });
  });
});
