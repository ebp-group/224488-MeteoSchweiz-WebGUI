import {ErrorHandler, inject, Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {TranslocoService} from '@jsverse/transloco';
import {pageConstants} from '../shared/constants/page.constant';
import {routeParamConstants} from '../shared/constants/route-param.constant';
import {OpendataExplorerRuntimeError, RecoverableError, SilentError} from '../shared/errors/base.error';
import {AngularDevModeService} from '../shared/services/angular-dev-mode.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly angularDevModeService = inject(AngularDevModeService);
  private readonly translocoService = inject(TranslocoService);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The interface definition of angular error-handlers defines any as an argument.
  public handleError(error: any): void {
    let message: string;
    if (error instanceof Error) {
      message =
        error instanceof OpendataExplorerRuntimeError
          ? this.translocoService.translate(error.message, error.translationArguments)
          : error.message;
    } else {
      message = JSON.stringify(error);
    }

    // log errors to console for easier debugging in non-productive environments
    if (this.angularDevModeService.isDevMode()) {
      console.error(error, message);
      if (error instanceof OpendataExplorerRuntimeError && error.originalError) {
        console.error('Original error was:', error.originalError);
      }
    }

    if (error instanceof SilentError) {
      // these errors should only be logged to a frontend logging service, but not displayed.
    } else if (error instanceof RecoverableError) {
      // At the moment, recoverable errors are treated the same as silent errors.
    } else {
      this.routeToErrorPage(message);
    }
  }

  private routeToErrorPage(message?: string): void {
    // sometimes, the error handler is not yet tied to the Angular zone, so we make sure it is run *within* the angular zone.
    this.zone.run(() => {
      void this.router.navigate([pageConstants.ERROR], {queryParams: {[routeParamConstants.ERROR]: message}, skipLocationChange: true});
    });
  }
}
