import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {routeParamConstants} from '../shared/constants/route-param.constants';
import {Page} from '../shared/enums/page.enum';
import {OpendataExplorerRuntimeError, RecoverableError, SilentError} from '../shared/errors/base.error';
import {AngularDevModeService} from '../shared/services/angular-dev-mode.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  constructor(
    private readonly router: Router,
    private readonly zone: NgZone,
    private readonly angularDevModeService: AngularDevModeService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleError(error: any) {
    // log errors to console for easier debugging in non-productive environments
    if (this.angularDevModeService.isDevMode()) {
      console.error(error);

      if (error instanceof OpendataExplorerRuntimeError && error.originalError) {
        console.error('Original error was:', error.originalError);
      }
    }

    if (error instanceof SilentError) {
      // these errors should only be logged to a frontend logging service, but not displayed.
    } else if (error instanceof RecoverableError) {
      this.showRecoverableErrorMessage(error.message);
    } else {
      this.routeToErrorPage(error.message);
    }
  }

  private showRecoverableErrorMessage(message: string) {
    // TODO show error notification
  }

  private routeToErrorPage(message?: string) {
    // sometimes, the error handler is not yet tied to the Angular zone, so we make sure it is run *within* the angular zone.
    this.zone.run(() => {
      void this.router.navigate([Page.Error], {queryParams: {[routeParamConstants.ERROR]: message}, skipLocationChange: true});
    });
  }
}
