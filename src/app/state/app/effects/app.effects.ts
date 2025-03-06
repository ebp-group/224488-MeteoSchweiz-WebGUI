import {inject} from '@angular/core';
import {TranslocoService} from '@jsverse/transloco';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, switchMap, tap} from 'rxjs';
import {UrlParameterService} from '../../../shared/services/url-parameter.service';
import {appActions} from '../actions/app.actions';

export const setLanguage = createEffect(
  (actions$ = inject(Actions), translocoService = inject(TranslocoService)) => {
    return actions$.pipe(
      ofType(appActions.setLanguage),
      tap(({language}) => translocoService.setActiveLang(language)),
    );
  },
  {functional: true, dispatch: false},
);

export const initializeLanguage = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(appActions.initializeApp),
      map(({parameter}) => appActions.setLanguage({language: parameter.language})),
    );
  },
  {functional: true},
);
