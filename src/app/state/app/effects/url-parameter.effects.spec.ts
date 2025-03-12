import {TestBed} from '@angular/core/testing';
import {routerNavigatedAction, RouterNavigatedPayload} from '@ngrx/router-store';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Observable, of} from 'rxjs';
import {AppUrlParameter} from '../../../shared/models/app-url-parameter';
import {UrlParameterService} from '../../../shared/services/url-parameter.service';
import {appActions} from '../actions/app.actions';
import {appFeature} from '../reducers/app.reducer';
import {initializeApp} from './url-parameter.effects';

describe('UrlParameterEffects', () => {
  let actions$: Observable<Action>;
  let store: MockStore;
  let urlParameterService: jasmine.SpyObj<UrlParameterService>;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    urlParameterService = jasmine.createSpyObj('UrlParameterService', ['transformUrlFragmentToAppUrlParameter']);
    TestBed.configureTestingModule({
      providers: [provideMockStore(), {provide: UrlParameterService, useValue: urlParameterService}],
    });
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('dispatches initializeApp action when routerNavigatedAction is dispatched and the app is not yet initialized', (done: DoneFn) => {
    const fragment = 'something';
    const appInitializeParameter: AppUrlParameter = {
      language: 'en',
      measurementDataType: 'homogenous',
      parameterGroupId: '123',
      stationId: '456',
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
