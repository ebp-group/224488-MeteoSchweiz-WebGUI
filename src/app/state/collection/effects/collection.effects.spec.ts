import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {catchError, EMPTY, Observable, of} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {CollectionError} from '../../../shared/errors/collection.error';
import {OpendataExplorerRuntimeErrorTestUtil} from '../../../shared/testing/utils/opendata-explorer-runtime-error-test.util';
import {AssetService} from '../../../stac/service/asset.service';
import {collectionActions} from '../actions/collection.action';
import {selectCurrentCollectionState} from '../selectors/collection.selector';
import {failLoadingCollectionAssets, loadCollectionAssets} from './collection.effects';

describe('Collection Effects', () => {
  const measurementDataType = collectionConfig.defaultMeasurementDataType;

  let actions$: Observable<Action>;
  let store: MockStore;
  let assetService: AssetService;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    store = TestBed.inject(MockStore);
    assetService = TestBed.inject(AssetService);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should dispatch the setCollectionAssets action when loading collections', (done: DoneFn) => {
    spyOn(assetService, 'loadCollectionAssets').and.resolveTo([]);
    const collections = ['collection'];
    store.overrideSelector(selectCurrentCollectionState, {collectionAssets: [], loadingState: undefined});
    actions$ = of(collectionActions.loadCollections({collections, measurementDataType}));

    loadCollectionAssets(actions$, store, assetService).subscribe((action) => {
      expect(action).toEqual(collectionActions.setCollectionAssets({assets: [], measurementDataType}));
      done();
    });
  });

  it('should not call the service if the data is already loaded', (done: DoneFn) => {
    spyOn(assetService, 'loadCollectionAssets');
    store.overrideSelector(selectCurrentCollectionState, {collectionAssets: [], loadingState: 'loaded'});
    actions$ = of(collectionActions.loadCollections({collections: ['collection'], measurementDataType}));

    loadCollectionAssets(actions$, store, assetService).subscribe({
      complete: () => {
        expect(assetService.loadCollectionAssets).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should set loading error if the service throws an error', (done: DoneFn) => {
    const error = new Error('test');
    spyOn(assetService, 'loadCollectionAssets').and.rejectWith(error);
    store.overrideSelector(selectCurrentCollectionState, {collectionAssets: [], loadingState: undefined});
    actions$ = of(collectionActions.loadCollections({collections: ['collection'], measurementDataType}));

    loadCollectionAssets(actions$, store, assetService).subscribe((action) => {
      expect(action).toEqual(collectionActions.setCollectionAssetLoadingError({error, measurementDataType}));
      done();
    });
  });

  it('should throw a Station error after dispatching setCollectionAssetLoadingError', (done: DoneFn) => {
    const error = new Error('My cabbages!!!');
    const expectedError = new CollectionError(error);

    actions$ = of(collectionActions.setCollectionAssetLoadingError({error, measurementDataType}));
    failLoadingCollectionAssets(actions$)
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
