import {provideHttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Observable, of} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {Station} from '../../../shared/models/station';
import {collectionActions} from '../../collection/actions/collection.action';
import {formActions} from '../actions/form.actions';
import {selectSelectedStationWithParameterGroupFilteredBySelectedParameterGroup} from '../selectors/form.selector';
import {autoSelectStationType, loadCollectionsForSelectedMeasurementDataType} from './form.effects';

describe('FormEffects', () => {
  const measurementDataType = collectionConfig.defaultMeasurementDataType;

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

  describe('autoSelectStationType', () => {
    it('should not dispatch selectCollection if no station is selected', (done: DoneFn) => {
      store.overrideSelector(selectSelectedStationWithParameterGroupFilteredBySelectedParameterGroup, [
        {station: {id: '2'} as Station, parameterGroups: []},
      ]);
      const effectNextHandler = jasmine.createSpy('effectNextHandler');

      actions$ = of(formActions.setSelectedStationId({stationId: null}));
      autoSelectStationType(actions$, store).subscribe({
        complete: () => {
          expect(effectNextHandler).not.toHaveBeenCalled();
          done();
        },
        next: effectNextHandler,
      });
    });

    it('should dispatch selectCollection if only a single station is left when filtered by parameter groups', (done: DoneFn) => {
      store.overrideSelector(selectSelectedStationWithParameterGroupFilteredBySelectedParameterGroup, [
        {station: {id: '2'} as Station, parameterGroups: []},
      ]);
      const effectNextHandler = jasmine.createSpy('effectNextHandler');

      actions$ = of(formActions.setSelectedStationId({stationId: '2'}));
      autoSelectStationType(actions$, store).subscribe({
        complete: () => {
          expect(effectNextHandler).toHaveBeenCalled();
          done();
        },
        next: effectNextHandler,
      });
    });

    it('should not dispatch selectCollection if multiple station are left when filtered by parameter groups', (done: DoneFn) => {
      store.overrideSelector(selectSelectedStationWithParameterGroupFilteredBySelectedParameterGroup, [
        {station: {id: '2'} as Station, parameterGroups: []},
        {station: {id: '2'} as Station, parameterGroups: []},
      ]);
      const effectNextHandler = jasmine.createSpy('effectNextHandler');

      actions$ = of(formActions.setSelectedStationId({stationId: '2'}));
      autoSelectStationType(actions$, store).subscribe({
        complete: () => {
          expect(effectNextHandler).not.toHaveBeenCalled();
          done();
        },
        next: effectNextHandler,
      });
    });

    it('should not dispatch selectCollection if no station is left when filtered by parameter groups', (done: DoneFn) => {
      store.overrideSelector(selectSelectedStationWithParameterGroupFilteredBySelectedParameterGroup, []);
      const effectNextHandler = jasmine.createSpy('effectNextHandler');

      actions$ = of(formActions.setSelectedStationId({stationId: '2'}));
      autoSelectStationType(actions$, store).subscribe({
        complete: () => {
          expect(effectNextHandler).not.toHaveBeenCalled();
          done();
        },
        next: effectNextHandler,
      });
    });
  });
});
