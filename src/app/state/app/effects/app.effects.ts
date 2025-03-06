import {inject} from '@angular/core';
import {TranslocoService} from '@jsverse/transloco';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {tap} from 'rxjs';
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
