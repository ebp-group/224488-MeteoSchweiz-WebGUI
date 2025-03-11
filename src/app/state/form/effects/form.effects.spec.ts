import {provideHttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Observable, of} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {StationWithParameterGroups} from '../../../shared/models/station-with-parameter-groups';
import {collectionActions} from '../../collection/actions/collection.action';
import {formActions} from '../actions/form.actions';
import {selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup} from '../selectors/form.selector';
import {autoSelectCollection, loadCollectionsForSelectedMeasurementDataType} from './form.effects';

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
