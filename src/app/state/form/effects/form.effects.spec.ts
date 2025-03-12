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
import {collectionActions} from '../../collection/actions/collection.action';
import {selectCombinedLoadingState} from '../../collection/selectors/collection.selector';
import {selectParameterGroups} from '../../parameters/selectors/parameter.selector';
import {selectCurrentStationState} from '../../stations/selectors/station.selector';
import {StationStateEntry} from '../../stations/states/station.state';
import {formActions} from '../actions/form.actions';
import {selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup} from '../selectors/form.selector';
import {
  autoSelectCollection,
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

  it('should dispatch setSelectedMeasurementDataType action when initializeApp is dispatched', (done: DoneFn) => {
    actions$ = of(appActions.initializeApp({parameter: {measurementDataType: 'homogenous'} as AppUrlParameter}));
    initializeSelectedMeasurementDataType(actions$).subscribe((action) => {
      expect(action).toEqual(formActions.setSelectedMeasurementDataType({measurementDataType: 'homogenous'}));
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
          },
        ] satisfies Station[],
      } as StationStateEntry);
      store.overrideSelector(selectParameterGroups, [{id: '123', name: {de: 'de', fr: 'fr', it: 'it', en: 'en'}}]);
    });

    it('should dispatch setSelectedParameterGroupAndStationIdAndCollection action when initializeApp is dispatched', (done) => {
      actions$ = of(
        appActions.initializeApp({parameter: {parameterGroupId: '123', stationId: '456', collection: '789'} as AppUrlParameter}),
      );
      initializeSelectedStationIdAndParameterGroupIdAndCollection(actions$, store).subscribe((action) => {
        expect(action).toEqual(
          formActions.setSelectedParameterGroupAndStationIdAndCollection({parameterGroupId: '123', stationId: '456', collection: '789'}),
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
          formActions.setSelectedParameterGroupAndStationIdAndCollection({parameterGroupId: '123', stationId: null, collection: null}),
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
          formActions.setSelectedParameterGroupAndStationIdAndCollection({parameterGroupId: null, stationId: '456', collection: null}),
        );
        done();
      });
    });
  });

  describe('autoSelectCollection', () => {
    it('should dispatch selectCollection if only a single station is left when filtered by parameter groups', (done: DoneFn) => {
      store.overrideSelector(selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup, [testStation]);

      actions$ = of(formActions.setSelectedStationId({stationId: '2'}));
      autoSelectCollection(actions$, store).subscribe((action) => {
        expect(action).toEqual(formActions.setSelectedCollection({collection: 'a'}));
        done();
      });
    });

    it('should dispatch selectCollection with null if multiple station are left when filtered by parameter groups', (done: DoneFn) => {
      store.overrideSelector(selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup, [testStation, testStation]);

      actions$ = of(formActions.setSelectedStationId({stationId: '2'}));
      autoSelectCollection(actions$, store).subscribe((action) => {
        expect(action).toEqual(formActions.setSelectedCollection({collection: null}));
        done();
      });
    });

    it('should dispatch selectCollection with null if no station is left when filtered by parameter groups', (done: DoneFn) => {
      store.overrideSelector(selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup, []);

      actions$ = of(formActions.setSelectedStationId({stationId: '2'}));
      autoSelectCollection(actions$, store).subscribe((action) => {
        expect(action).toEqual(formActions.setSelectedCollection({collection: null}));
        done();
      });
    });
  });
});
