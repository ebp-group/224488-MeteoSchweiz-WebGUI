import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {routerNavigatedAction} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {filter, map} from 'rxjs';
import {UrlParameterService} from '../../../shared/services/url-parameter.service';
import {appActions} from '../actions/app.actions';
import {appFeature} from '../reducers/app.reducer';

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
