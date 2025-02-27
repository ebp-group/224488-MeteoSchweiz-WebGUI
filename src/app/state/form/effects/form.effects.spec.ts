import {provideHttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Observable, of} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {collectionActions} from '../../collection/actions/collection.action';
import {formActions} from '../actions/form.actions';
import {loadCollectionsForSelectedMeasurementDataType, removeStationSelectionOnSelectedParameterChange} from './form.effects';

describe('FormEffects', () => {
  const measurementDataType = collectionConfig.defaultMeasurementDataType;

  let actions$: Observable<Action>;
  let store: MockStore;

  beforeEach(() => {
    actions$ = new Observable<Action>();
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

  it('should dispatch the setSelectedStationId action with `null` when the selected parameter changes', (done: DoneFn) => {
    actions$ = of(formActions.setSelectedParameters({parameterGroupId: 'newParameterGroupId'}));
    removeStationSelectionOnSelectedParameterChange(actions$).subscribe((action) => {
      expect(action).toEqual(formActions.setSelectedStationId({stationId: null}));
      done();
    });
  });
});
