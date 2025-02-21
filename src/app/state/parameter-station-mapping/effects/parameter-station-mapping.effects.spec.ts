import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {catchError, EMPTY, Observable, of} from 'rxjs';
import {ParameterStationMappingError} from '../../../shared/errors/parameter-station-mapping.error';
import {DataInventoryService} from '../../../stac/service/data-inventory.service';
import {collectionActions} from '../../collection/actions/collection.action';
import {parameterStationMappingActions} from '../actions/parameter-station-mapping.action';
import {parameterStationMappingFeature} from '../reducers/parameter-station-mapping.reducer';
import {
  failLoadingCollectionParameterStationMappings,
  loadCollectionParameterStationMappings,
  loadParameterStationMappings,
} from './parameter-station-mapping.effects';

describe('ParameterStationMappingEffects', () => {
  let actions$: Observable<Action>;
  let store: MockStore;
  let dataInventoryService: DataInventoryService;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    store = TestBed.inject(MockStore);
    dataInventoryService = TestBed.inject(DataInventoryService);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should dispatch loadParameterStationMapping action when loadCollection is dispatched', (done: DoneFn) => {
    const collections = ['collection'];
    actions$ = of(collectionActions.loadCollections({collections}));
    loadCollectionParameterStationMappings(actions$).subscribe((action) => {
      expect(action).toEqual(parameterStationMappingActions.loadParameterStationMappingsForCollections({collections}));
      done();
    });
  });

  it('should dispatch the SetParameterStationMapping action when loading parameterStationMappings for collections', (done: DoneFn) => {
    spyOn(dataInventoryService, 'loadParameterStationMappingsForCollections').and.resolveTo([]);
    actions$ = of(parameterStationMappingActions.loadParameterStationMappingsForCollections({collections: ['collection']}));

    loadParameterStationMappings(actions$, store, dataInventoryService).subscribe((action) => {
      expect(action).toEqual(parameterStationMappingActions.setLoadedParameterStationMappings({parameterStationMappings: []}));
      done();
    });
  });

  it('should not call the service if the data is already loaded', (done: DoneFn) => {
    spyOn(dataInventoryService, 'loadParameterStationMappingsForCollections');
    store.overrideSelector(parameterStationMappingFeature.selectLoadingState, 'loaded');
    actions$ = of(parameterStationMappingActions.loadParameterStationMappingsForCollections({collections: ['collection']}));

    loadParameterStationMappings(actions$, store, dataInventoryService).subscribe({
      complete: () => {
        expect(dataInventoryService.loadParameterStationMappingsForCollections).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should throw a ParameterStationMapping error after dispatching setParameterStationMappingLoadingError', (done: DoneFn) => {
    const error = new Error('My cabbages!!!');
    const expectedError = new ParameterStationMappingError(error);

    actions$ = of(parameterStationMappingActions.setParameterStationMappingLoadingError({error}));
    failLoadingCollectionParameterStationMappings(actions$)
      .pipe(
        catchError((caughtError: unknown) => {
          expect(caughtError).toEqual(expectedError);
          done();
          return EMPTY;
        }),
      )
      .subscribe();
  });

  it('should set loading error if the service throws an error', (done: DoneFn) => {
    const error = new Error('test');
    spyOn(dataInventoryService, 'loadParameterStationMappingsForCollections').and.rejectWith(error);
    actions$ = of(parameterStationMappingActions.loadParameterStationMappingsForCollections({collections: ['collection']}));

    loadParameterStationMappings(actions$, store, dataInventoryService).subscribe((action) => {
      expect(action).toEqual(parameterStationMappingActions.setParameterStationMappingLoadingError({error}));
      done();
    });
  });
});
