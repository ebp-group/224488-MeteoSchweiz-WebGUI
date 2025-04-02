import {provideHttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Observable, of} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {AppUrlParameter} from '../../../shared/models/app-url-parameter';
import {Station} from '../../../shared/models/station';
import {StationWithParameterGroups} from '../../../shared/models/station-with-parameter-groups';
import {appActions} from '../../app/actions/app.actions';
import {assetFeature} from '../../assets/reducers/asset.reducer';
import {collectionActions} from '../../collection/actions/collection.action';
import {selectCombinedLoadingState} from '../../collection/selectors/collection.selector';
import {selectParameterGroups} from '../../parameters/selectors/parameter.selector';
import {selectCurrentStationState} from '../../stations/selectors/station.selector';
import {StationStateEntry} from '../../stations/states/station.state';
import {formActions} from '../actions/form.actions';
import {formFeature} from '../reducers/form.reducer';
import {selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup} from '../selectors/form.selector';
import {FormState} from '../states/form.state';
import {
  autoSelectFirstCollection,
  initializeSelectedDataIntervalAndTimeRange,
  initializeSelectedMeasurementDataType,
  initializeSelectedStationIdAndParameterGroupIdAndCollection,
  loadCollectionsForSelectedMeasurementDataType,
} from './form.effects';

describe('FormEffects', () => {
  const measurementDataType = collectionConfig.defaultMeasurementDataType;
  const testStation: StationWithParameterGroups = {
    id: '2',
    collection: 'a',
    coordinates: {latitude: 0, longitude: 0},
    displayName: '',
    name: '',
    type: {de: 'de', en: 'en', fr: 'fr', it: 'it'},
    parameterGroups: [],
    elevation: 0,
    url: {
      de: 'url de',
      en: 'url en',
      fr: 'url fr',
      it: 'url it',
    },
  };

  let actions$: Observable<Action>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), provideHttpClient()],
    });
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should dispatch loadCollection action when setSelectedMeasurementDataType is dispatched', (done: DoneFn) => {
    actions$ = of(formActions.setSelectedMeasurementDataType({measurementDataType}));

    loadCollectionsForSelectedMeasurementDataType(actions$).subscribe((action) => {
      expect(action).toEqual(
        collectionActions.loadCollections({collections: collectionConfig.collections[measurementDataType], measurementDataType}),
      );
      done();
    });
  });

  it('should dispatch initializeSelectedMeasurementDataType action when initializeApp is dispatched', (done: DoneFn) => {
    actions$ = of(appActions.initializeApp({parameter: {measurementDataType: 'homogenous'} as AppUrlParameter}));
    initializeSelectedMeasurementDataType(actions$).subscribe((action) => {
      expect(action).toEqual(formActions.initializeSelectedMeasurementDataType({measurementDataType: 'homogenous'}));
      done();
    });
  });

  describe('initializeSelectedStationIdAndParameterGroupIdAndCollection', () => {
    beforeEach(() => {
      store.overrideSelector(selectCombinedLoadingState, 'loaded');
      store.overrideSelector(selectCurrentStationState, {
        stations: [
          {
            id: '456',
            name: '',
            displayName: '',
            coordinates: {longitude: 0, latitude: 0},
            collection: '789',
            type: {de: 'de', fr: 'fr', it: 'it', en: 'en'},
            elevation: 0,
            url: {
              de: 'url de',
              en: 'url en',
              fr: 'url fr',
              it: 'url it',
            },
          },
        ] satisfies Station[],
      } as StationStateEntry);
      store.overrideSelector(selectParameterGroups, [{id: '123', name: {de: 'de', fr: 'fr', it: 'it', en: 'en'}}]);
    });

    it('should dispatch initializeSelectedParameterGroupAndStationIdAndCollection action when initializeApp is dispatched', (done) => {
      actions$ = of(
        appActions.initializeApp({parameter: {parameterGroupId: '123', stationId: '456', collection: '789'} as AppUrlParameter}),
      );
      initializeSelectedStationIdAndParameterGroupIdAndCollection(actions$, store).subscribe((action) => {
        expect(action).toEqual(
          formActions.initializeSelectedParameterGroupAndStationIdAndCollection({
            parameterGroupId: '123',
            stationId: '456',
            collection: '789',
          }),
        );
        done();
      });
    });

    it('should replace invalid station ID and collection with `null`', (done) => {
      actions$ = of(
        appActions.initializeApp({parameter: {parameterGroupId: '123', stationId: 'invalid', collection: 'invalid'} as AppUrlParameter}),
      );
      initializeSelectedStationIdAndParameterGroupIdAndCollection(actions$, store).subscribe((action) => {
        expect(action).toEqual(
          formActions.initializeSelectedParameterGroupAndStationIdAndCollection({
            parameterGroupId: '123',
            stationId: null,
            collection: null,
          }),
        );
        done();
      });
    });

    it('should replace invalid parameter group ID and collection with `null`', (done) => {
      actions$ = of(
        appActions.initializeApp({parameter: {parameterGroupId: 'invalid', stationId: '456', collection: 'invalid'} as AppUrlParameter}),
      );
      initializeSelectedStationIdAndParameterGroupIdAndCollection(actions$, store).subscribe((action) => {
        expect(action).toEqual(
          formActions.initializeSelectedParameterGroupAndStationIdAndCollection({
            parameterGroupId: null,
            stationId: '456',
            collection: null,
          }),
        );
        done();
      });
    });
  });

  describe('autoSelectCollection', () => {
    it('should dispatch selectCollection if only a single station is left when filtered by parameter groups', (done: DoneFn) => {
      store.overrideSelector(selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup, [testStation]);

      actions$ = of(formActions.setSelectedStationId({stationId: '2'}));
      autoSelectFirstCollection(actions$, store).subscribe((action) => {
        expect(action).toEqual(formActions.setSelectedCollection({collection: 'a'}));
        done();
      });
    });

    it('should dispatch selectCollection with the first station if multiple station are left when filtered by parameter groups', (done: DoneFn) => {
      store.overrideSelector(selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup, [
        {...testStation, collection: 'first'},
        {...testStation, collection: 'second'},
      ]);

      actions$ = of(formActions.setSelectedStationId({stationId: '2'}));
      autoSelectFirstCollection(actions$, store).subscribe((action) => {
        expect(action).toEqual(formActions.setSelectedCollection({collection: 'first'}));
        done();
      });
    });

    it('should dispatch selectCollection with null if no station is left when filtered by parameter groups', (done: DoneFn) => {
      store.overrideSelector(selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup, []);

      actions$ = of(formActions.setSelectedStationId({stationId: '2'}));
      autoSelectFirstCollection(actions$, store).subscribe((action) => {
        expect(action).toEqual(formActions.setSelectedCollection({collection: null}));
        done();
      });
    });
  });

  describe('initializeSelectedDataIntervalAndTimeRange', () => {
    let startDate: Date;
    let endDate: Date;

    beforeEach(() => {
      startDate = new Date('2021-01-01');
      endDate = new Date('2021-02-01');
      store.overrideSelector(assetFeature.selectAssetState, {
        assets: [
          {
            filename: 'filename',
            url: 'url',
            interval: 'monthly',
            timeRange: 'historical',
            dateRange: {start: startDate, end: endDate},
          },
        ],
        loadingState: 'loaded',
      });
      store.overrideSelector(formFeature.selectFormState, {
        isParameterGroupStationAndCollectionInitialized: true,
        selectedStationId: '123',
        selectedCollection: 'abc',
      } as FormState);
    });

    it('should dispatch initializeSelectedDataIntervalAndTimeRange action when initializeApp is dispatched', (done) => {
      actions$ = of(
        appActions.initializeApp({
          parameter: {
            dataInterval: 'monthly',
            timeRange: 'historical',
            historicalDateRange: {start: startDate, end: endDate},
          } as AppUrlParameter,
        }),
      );
      initializeSelectedDataIntervalAndTimeRange(actions$, store).subscribe((action) => {
        expect(action).toEqual(
          formActions.initializeSelectedDataIntervalAndTimeRange({
            dataInterval: 'monthly',
            timeRange: 'historical',
            historicalDateRange: {start: startDate, end: endDate},
          }),
        );
        done();
      });
    });

    it('should replace entries that have no corresponding assets with `null`', (done) => {
      actions$ = of(
        appActions.initializeApp({
          parameter: {
            dataInterval: 'ten-minutes',
            timeRange: 'recent',
            historicalDateRange: {start: new Date('2023-03-03'), end: new Date('2023-04-03')},
          } as AppUrlParameter,
        }),
      );
      initializeSelectedDataIntervalAndTimeRange(actions$, store).subscribe((action) => {
        expect(action).toEqual(
          formActions.initializeSelectedDataIntervalAndTimeRange({
            dataInterval: null,
            timeRange: null,
            historicalDateRange: null,
          }),
        );
        done();
      });
    });
  });
});
