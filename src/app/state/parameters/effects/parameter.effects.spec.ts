import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Observable, of} from 'rxjs';
import {ParameterService} from '../../../stac/service/parameter.service';
import {collectionActions} from '../../collection/actions/collection.action';
import {parameterActions} from '../actions/parameter.action';
import {parameterFeature} from '../reducers/parameter.reducer';
import {loadCollectionParameters, loadParameters} from './parameter.effects';

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

  it('should dispatch loadParameter action when loadCollection is dispatched', (done: DoneFn) => {
    const collections = ['collection'];
    actions$ = of(collectionActions.loadCollections({collections}));
    loadCollectionParameters(actions$).subscribe((action) => {
      expect(action).toEqual(parameterActions.loadParameterForCollections({collections}));
      done();
    });
  });

  it('should dispatch the SetParameter action when loading parameters for collections', (done: DoneFn) => {
    spyOn(parameterService, 'loadParameterForCollections').and.resolveTo([]);
    actions$ = of(parameterActions.loadParameterForCollections({collections: ['collection']}));

    loadParameters(actions$, store, parameterService).subscribe((action) => {
      expect(action).toEqual(parameterActions.setLoadedParameters({parameters: []}));
      done();
    });
  });

  it('should not call the service if the data is already loaded', () => {
    spyOn(parameterService, 'loadParameterForCollections');
    store.overrideSelector(parameterFeature.selectLoadingState, 'loaded');
    actions$ = of(parameterActions.loadParameterForCollections({collections: ['collection']}));

    loadParameters(actions$, store, parameterService).subscribe({
      complete: () => {
        expect(parameterService.loadParameterForCollections).not.toHaveBeenCalled();
      },
    });
  });

  it('should set loading error if the service throws an error', (done: DoneFn) => {
    const error = new Error('test');
    spyOn(parameterService, 'loadParameterForCollections').and.rejectWith(error);
    actions$ = of(parameterActions.loadParameterForCollections({collections: ['collection']}));

    loadParameters(actions$, store, parameterService).subscribe((action) => {
      expect(action).toEqual(parameterActions.setParameterLoadingError({error}));
      done();
    });
  });
});
