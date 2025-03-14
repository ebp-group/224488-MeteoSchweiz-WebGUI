import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {routerNavigatedAction} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {filter, map, tap} from 'rxjs';
import {UrlParameterService} from '../../../shared/services/url-parameter.service';
import {formActions} from '../../form/actions/form.actions';
import {appActions} from '../actions/app.actions';
import {appFeature} from '../reducers/app.reducer';
import {selectCurrentAppUrlParameter} from '../selectors/app.selector';

export const initializeApp = createEffect(
  (actions$ = inject(Actions), store = inject(Store), urlParameterService = inject(UrlParameterService)) => {
    return actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => store.select(appFeature.selectIsInitialized)),
      filter(([, isInitialized]) => !isInitialized),
      map(([{payload}]) => {
        const fragment = payload.routerState.root.fragment ?? undefined;
        const appInitializeParameter = urlParameterService.transformUrlFragmentToAppUrlParameter(fragment);
        return appActions.initializeApp({parameter: appInitializeParameter});
      }),
    );
  },
  {functional: true},
);

export const setUrlParameter = createEffect(
  (actions$ = inject(Actions), store = inject(Store), urlParameterService = inject(UrlParameterService)) => {
    return actions$.pipe(
      ofType(
        appActions.setLanguage,
        formActions.setSelectedMeasurementDataType,
        formActions.setSelectedParameters,
        formActions.setSelectedStationId,
        formActions.setSelectedCollection,
        formActions.setSelectedDataInterval,
        formActions.setSelectedTimeRange,
      ),
      concatLatestFrom(() => store.select(selectCurrentAppUrlParameter)),
      tap(([, appUrlParameter]) => urlParameterService.setUrlFragment(appUrlParameter)),
    );
  },
  {functional: true, dispatch: false},
);
