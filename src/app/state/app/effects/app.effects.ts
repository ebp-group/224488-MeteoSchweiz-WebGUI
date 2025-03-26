import {inject} from '@angular/core';
import {TranslocoService} from '@jsverse/transloco';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, tap} from 'rxjs';
import {appActions} from '../actions/app.actions';

export const setLanguage = createEffect(
  (actions$ = inject(Actions), translocoService = inject(TranslocoService)) => {
    return actions$.pipe(
      ofType(appActions.setLanguage, appActions.initializeLanguage),
      tap(({language}) => translocoService.setActiveLang(language)),
    );
  },
  {functional: true, dispatch: false},
);

export const initializeLanguage = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(appActions.initializeApp),
      map(({parameter}) => appActions.initializeLanguage({language: parameter.language})),
    );
  },
  {functional: true},
);
