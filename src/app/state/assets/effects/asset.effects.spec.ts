import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {catchError, EMPTY, Observable, of} from 'rxjs';
import {AssetLoadError} from '../../../shared/errors/asset.error';
import {StationAsset} from '../../../shared/models/station-assets';
import {OpendataExplorerRuntimeErrorTestUtil} from '../../../shared/testing/utils/opendata-explorer-runtime-error-test.util';
import {AssetService} from '../../../stac/service/asset.service';
import {formActions} from '../../form/actions/form.actions';
import {formFeature} from '../../form/reducers/form.reducer';
import {FormState} from '../../form/states/form.state';
import {assetActions} from '../actions/asset.actions';
import {failLoadingAssets, loadAssetsForStation} from './asset.effects';

describe('AssetEffects', () => {
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

  describe('loadAssetsForStation', () => {
    it('should dispatch setLoadedAssets after successfully loading assets', (done: DoneFn) => {
      const assets: StationAsset[] = [
        {
          timeRange: 'recent',
          url: 'testUrl',
          filename: 'testFilename',
          interval: 'monthly',
        },
      ];
      store.overrideSelector(formFeature.selectFormState, {
        selectedStationId: 'testStationId',
        selectedCollection: 'testCollection',
      } as FormState);
      spyOn(assetService, 'loadStationAssets').and.resolveTo(assets);
      actions$ = of(formActions.setSelectedCollection({collection: 'testCollection'}));

      loadAssetsForStation(actions$, store, assetService).subscribe((action) => {
        expect(assetService.loadStationAssets).toHaveBeenCalledOnceWith('testCollection', 'testStationId');
        expect(action).toEqual(assetActions.setLoadedAssets({assets}));
        done();
      });
    });

    it('should dispatch setAssetLoadingError if the service throws an error during loading', (done: DoneFn) => {
      const error = new Error('test');
      spyOn(assetService, 'loadStationAssets').and.rejectWith(error);
      store.overrideSelector(formFeature.selectFormState, {
        selectedStationId: 'testStationId',
        selectedCollection: 'testCollection',
      } as FormState);
      actions$ = of(formActions.setSelectedCollection({collection: 'testCollection'}));

      loadAssetsForStation(actions$, store, assetService).subscribe((action) => {
        expect(action).toEqual(assetActions.setAssetLoadingError({error}));
        done();
      });
    });

    it('should call the assetService if the given stationId is null', (done) => {
      spyOn(assetService, 'loadStationAssets');
      store.overrideSelector(formFeature.selectFormState, {
        selectedStationId: null,
        selectedCollection: 'testCollection',
      } as FormState);
      actions$ = of(formActions.setSelectedCollection({collection: 'testCollection'}));

      loadAssetsForStation(actions$, store, assetService).subscribe({
        complete: () => {
          expect(assetService.loadStationAssets).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should call the assetService if the given collection is null', (done) => {
      spyOn(assetService, 'loadStationAssets');
      store.overrideSelector(formFeature.selectFormState, {
        selectedStationId: 'testStationId',
        selectedCollection: null,
      } as FormState);
      actions$ = of(formActions.setSelectedCollection({collection: null}));

      loadAssetsForStation(actions$, store, assetService).subscribe({
        complete: () => {
          expect(assetService.loadStationAssets).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });

  it('should throw a AssetLoadError after dispatching setAssetLoadingError', (done: DoneFn) => {
    const error = new Error('My cabbages!!!');
    const expectedError = new AssetLoadError(error);

    actions$ = of(assetActions.setAssetLoadingError({error}));
    failLoadingAssets(actions$)
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
