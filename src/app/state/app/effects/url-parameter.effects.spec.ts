import {TestBed} from '@angular/core/testing';
import {routerNavigatedAction, RouterNavigatedPayload} from '@ngrx/router-store';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Observable, of} from 'rxjs';
import {AppUrlParameter} from '../../../shared/models/app-url-parameter';
import {UrlParameterService} from '../../../shared/services/url-parameter.service';
import {formActions} from '../../form/actions/form.actions';
import {appActions} from '../actions/app.actions';
import {appFeature} from '../reducers/app.reducer';
import {selectCurrentAppUrlParameter} from '../selectors/app.selector';
import {initializeApp, setUrlParameter} from './url-parameter.effects';

describe('UrlParameterEffects', () => {
  let actions$: Observable<Action>;
  let store: MockStore;
  let urlParameterService: jasmine.SpyObj<UrlParameterService>;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    urlParameterService = jasmine.createSpyObj('UrlParameterService', ['transformUrlFragmentToAppUrlParameter', 'setUrlFragment']);
    TestBed.configureTestingModule({
      providers: [provideMockStore(), {provide: UrlParameterService, useValue: urlParameterService}],
    });
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  describe('initializeApp', () => {
    it('dispatches initializeApp action when routerNavigatedAction is dispatched and the app is not yet initialized', (done: DoneFn) => {
      const fragment = 'something';
      const appInitializeParameter: AppUrlParameter = {
        language: 'en',
        measurementDataType: 'homogenous',
        parameterGroupId: '123',
        stationId: '456',
        collection: '789',
        dataInterval: 'yearly',
        timeRange: 'historical',
      };
      urlParameterService.transformUrlFragmentToAppUrlParameter.and.returnValue(appInitializeParameter);
      store.overrideSelector(appFeature.selectIsInitialized, false);
      const payload = {routerState: {root: {fragment}}} as RouterNavigatedPayload;
      actions$ = of(routerNavigatedAction({payload}));

      initializeApp(actions$, store, urlParameterService).subscribe((action) => {
        expect(action).toEqual(appActions.initializeApp({parameter: appInitializeParameter}));
        done();
      });
    });

    it('does not dispatch initializeApp action if app is already initialized', (done: DoneFn) => {
      store.overrideSelector(appFeature.selectIsInitialized, true);
      const payload = {routerState: {root: {fragment: null}}} as RouterNavigatedPayload;
      actions$ = of(routerNavigatedAction({payload}));

      initializeApp(actions$, store, urlParameterService).subscribe({
        complete: () => {
          expect(urlParameterService.transformUrlFragmentToAppUrlParameter).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('setUrlParameter', () => {
    it('calls urlParameterService when setSelectedMeasurementDataType is dispatched', (done: DoneFn) => {
      const appUrlParameter: AppUrlParameter = {
        language: 'en',
        measurementDataType: 'homogenous',
        parameterGroupId: null,
        stationId: null,
        collection: null,
        dataInterval: null,
        timeRange: null,
      };
      store.overrideSelector(selectCurrentAppUrlParameter, appUrlParameter);
      actions$ = of(formActions.setSelectedMeasurementDataType({measurementDataType: 'homogenous'}));
      setUrlParameter(actions$, store, urlParameterService).subscribe(() => {
        expect(urlParameterService.setUrlFragment).toHaveBeenCalledOnceWith(appUrlParameter);
        done();
      });
    });
  });
});
