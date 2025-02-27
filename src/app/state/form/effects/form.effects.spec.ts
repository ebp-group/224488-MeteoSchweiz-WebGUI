import {provideHttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Observable, of} from 'rxjs';
import {formActions} from '../actions/form.actions';
import {removeStationSelectionOnSelectedParameterChange} from './form.effects';

describe('FormEffects', () => {
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

  it('should dispatch the setSelectedStationId action with `null` when the selected parameter changes', (done: DoneFn) => {
    actions$ = of(formActions.setSelectedParameters({parameterGroupId: 'newParameterGroupId'}));
    removeStationSelectionOnSelectedParameterChange(actions$).subscribe((action) => {
      expect(action).toEqual(formActions.setSelectedStationId({stationId: null}));
      done();
    });
  });
});
