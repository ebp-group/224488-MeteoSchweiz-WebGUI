import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {catchError, EMPTY, Observable, of} from 'rxjs';
import {ParameterError} from '../../../shared/errors/parameter.error';
import {ParameterService} from '../../../stac/service/parameter.service';
import {parameterActions} from '../actions/parameter.action';
import {parameterFeature} from '../reducers/parameter.reducer';
import {failLoadingCollectionParameters, loadCollectionParameters} from './parameter.effects';

describe('ParameterEffects', () => {
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

  it('should dispatch the SetParameter action when loading parameters for collections', () => {
    spyOn(parameterService, 'loadParameterForCollections').and.resolveTo([]);
    actions$ = of(parameterActions.loadParameterForCollections({collections: ['collection']}));

    loadCollectionParameters(actions$, store, parameterService).subscribe((action) =>
      expect(action).toEqual(parameterActions.setLoadedParameters({parameters: []})),
    );
  });

  it('should not call the service if the data is already loaded', () => {
    spyOn(parameterService, 'loadParameterForCollections');
    store.overrideSelector(parameterFeature.selectLoadingState, 'loaded');
    actions$ = of(parameterActions.loadParameterForCollections({collections: ['collection']}));

    loadCollectionParameters(actions$, store, parameterService).subscribe({
      complete: () => {
        expect(parameterService.loadParameterForCollections).not.toHaveBeenCalled();
      },
    });
  });

  it('should throw a Parameter error after dispatching setParameterLoadingError', (done: DoneFn) => {
    const error = new Error('My cabbages!!!');
    const expectedError = new ParameterError(error);

    actions$ = of(parameterActions.setParameterLoadingError({error}));
    failLoadingCollectionParameters(actions$)
      .pipe(
        catchError((caughtError: unknown) => {
          expect(caughtError).toEqual(expectedError);
          done();
          return EMPTY;
        }),
      )
      .subscribe();
  });
});
