import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {collectionActions} from '../../collection/actions/collection.action';
import {formActions} from '../actions/form.actions';
import {loadCollectionsForSelectedMeasurementDataType} from './form.effects';

describe('FormEffects', () => {
  const measurementDataType = collectionConfig.defaultMeasurementDataType;

  let actions$: Observable<Action>;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    TestBed.configureTestingModule({});
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
});
