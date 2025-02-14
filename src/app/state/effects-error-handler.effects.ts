import {ErrorHandler} from '@angular/core';
import {Action} from '@ngrx/store';
import {catchError, Observable} from 'rxjs';

// This effect is used to overwrite the default error handler from NGRX with our custom error handler.
// This was done because the effects pipeline would die after ten errors within an effect.
// Now, errors inside the effects can be handled like anywhere else in the application.
// For more information see: https://ngrx.io/guide/effects/lifecycle#customizing-the-effects-error-handler
export function effectErrorHandler<T extends Action>(observable$: Observable<T>, errorHandler: ErrorHandler): Observable<T> {
  return observable$.pipe(
    // eslint-disable-next-line rxjs-x/no-implicit-any-catch
    catchError((error, caught) => {
      errorHandler.handleError(error);
      return caught;
    }),
  );
}
