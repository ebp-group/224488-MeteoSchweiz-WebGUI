import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Observable, of} from 'rxjs';
import {ParameterService} from '../../../stac/service/parameter.service';
import {parameterActions} from '../actions/parameter.action';
import {parameterFeature} from '../reducers/parameter.reducer';
import {loadCollectionParameters} from './parameter.effects';

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
});
