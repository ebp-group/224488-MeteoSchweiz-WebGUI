import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {catchError, EMPTY, Observable, of} from 'rxjs';
import {StationError} from '../../../shared/errors/station.error';
import {OpendataExplorerRuntimeErrorTestUtil} from '../../../shared/testing/utils/opendata-explorer-runtime-error-test.util';
import {StationService} from '../../../stac/service/station.service';
import {collectionActions} from '../../collection/actions/collection.action';
import {stationActions} from '../actions/station.action';
import {stationFeature} from '../reducers/station.reducer';
import {failLoadingCollectionStations, loadCollectionStations, loadStations} from './station.effects';

describe('StationEffects', () => {
  let actions$: Observable<Action>;
  let store: MockStore;
  let stationService: StationService;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    store = TestBed.inject(MockStore);
    stationService = TestBed.inject(StationService);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should dispatch loadStations action when loadCollection is dispatched', (done: DoneFn) => {
    const collections = ['collection'];
    actions$ = of(collectionActions.loadCollections({collections}));
    loadCollectionStations(actions$).subscribe((action) => {
      expect(action).toEqual(stationActions.loadStationsForCollections({collections}));
      done();
    });
  });

  it('should dispatch the setStations action when loading stations for collections', (done: DoneFn) => {
    spyOn(stationService, 'loadStationsForCollections').and.resolveTo([]);
    actions$ = of(stationActions.loadStationsForCollections({collections: ['collection']}));

    loadStations(actions$, store, stationService).subscribe((action) => {
      expect(action).toEqual(stationActions.setLoadedStations({stations: []}));
      done();
    });
  });

  it('should not call the service if the data is already loaded', (done: DoneFn) => {
    spyOn(stationService, 'loadStationsForCollections');
    store.overrideSelector(stationFeature.selectLoadingState, 'loaded');
    actions$ = of(stationActions.loadStationsForCollections({collections: ['collection']}));

    loadStations(actions$, store, stationService).subscribe({
      complete: () => {
        expect(stationService.loadStationsForCollections).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should set loading error if the service throws an error', (done: DoneFn) => {
    const error = new Error('test');
    spyOn(stationService, 'loadStationsForCollections').and.rejectWith(error);
    actions$ = of(stationActions.loadStationsForCollections({collections: ['collection']}));

    loadStations(actions$, store, stationService).subscribe((action) => {
      expect(action).toEqual(stationActions.setStationLoadingError({error}));
      done();
    });
  });

  it('should throw a Station error after dispatching setStationLoadingError', (done: DoneFn) => {
    const error = new Error('My cabbages!!!');
    const expectedError = new StationError(error);

    actions$ = of(stationActions.setStationLoadingError({error}));
    failLoadingCollectionStations(actions$)
      .pipe(
        catchError((caughtError: unknown) => {
          OpendataExplorerRuntimeErrorTestUtil.expectToDeepEqual(caughtError, expectedError);
          done();
          return EMPTY;
        }),
      )
      .subscribe();
  });
});
