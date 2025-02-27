import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {catchError, EMPTY, Observable, of} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {ParameterStationMappingError} from '../../../shared/errors/parameter-station-mapping.error';
import {OpendataExplorerRuntimeErrorTestUtil} from '../../../shared/testing/utils/opendata-explorer-runtime-error-test.util';
import {DataInventoryService} from '../../../stac/service/data-inventory.service';
import {collectionActions} from '../../collection/actions/collection.action';
import {parameterStationMappingActions} from '../actions/parameter-station-mapping.action';
import {selectCurrentParameterStationMappingState} from '../selectors/parameter-group-station-mapping.selector';
import {
  failLoadingCollectionParameterStationMappings,
  loadCollectionParameterStationMappings,
  loadParameterStationMappings,
} from './parameter-station-mapping.effects';

describe('ParameterStationMappingEffects', () => {
  const measurementDataType = collectionConfig.defaultMeasurementDataType;

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
    actions$ = of(collectionActions.loadCollections({collections, measurementDataType}));
    loadCollectionParameterStationMappings(actions$).subscribe((action) => {
      expect(action).toEqual(parameterStationMappingActions.loadParameterStationMappingsForCollections({collections, measurementDataType}));
      done();
    });
  });

  it('should dispatch the SetParameterStationMapping action when loading parameterStationMappings for collections', (done: DoneFn) => {
    spyOn(dataInventoryService, 'loadParameterStationMappingsForCollections').and.resolveTo([]);
    store.overrideSelector(selectCurrentParameterStationMappingState, {parameterStationMappings: [], loadingState: undefined});
    actions$ = of(
      parameterStationMappingActions.loadParameterStationMappingsForCollections({collections: ['collection'], measurementDataType}),
    );

    loadParameterStationMappings(actions$, store, dataInventoryService).subscribe((action) => {
      expect(action).toEqual(
        parameterStationMappingActions.setLoadedParameterStationMappings({parameterStationMappings: [], measurementDataType}),
      );
      done();
    });
  });

  it('should not call the service if the data is already loaded', (done: DoneFn) => {
    spyOn(dataInventoryService, 'loadParameterStationMappingsForCollections');
    store.overrideSelector(selectCurrentParameterStationMappingState, {parameterStationMappings: [], loadingState: 'loaded'});
    actions$ = of(
      parameterStationMappingActions.loadParameterStationMappingsForCollections({collections: ['collection'], measurementDataType}),
    );

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

    actions$ = of(parameterStationMappingActions.setParameterStationMappingLoadingError({error, measurementDataType}));
    failLoadingCollectionParameterStationMappings(actions$)
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
    store.overrideSelector(selectCurrentParameterStationMappingState, {parameterStationMappings: [], loadingState: undefined});
    spyOn(dataInventoryService, 'loadParameterStationMappingsForCollections').and.rejectWith(error);
    actions$ = of(
      parameterStationMappingActions.loadParameterStationMappingsForCollections({collections: ['collection'], measurementDataType}),
    );

    loadParameterStationMappings(actions$, store, dataInventoryService).subscribe((action) => {
      expect(action).toEqual(parameterStationMappingActions.setParameterStationMappingLoadingError({error, measurementDataType}));
      done();
    });
  });
});
