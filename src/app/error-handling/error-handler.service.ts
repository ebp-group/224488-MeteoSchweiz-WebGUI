import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {TranslocoService} from '@jsverse/transloco';
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
    private readonly translocoService: TranslocoService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The interface definition of angular error-handlers defines any as an argument.
  public handleError(error: any): void {
    // log errors to console for easier debugging in non-productive environments
    if (this.angularDevModeService.isDevMode()) {
      console.error(error);

      if (error instanceof OpendataExplorerRuntimeError && error.originalError) {
        console.error('Original error was:', error.originalError);
      }
    }

    const translatedMessage = this.translocoService.translate(error.message);
    if (error instanceof SilentError) {
      // these errors should only be logged to a frontend logging service, but not displayed.
    } else if (error instanceof RecoverableError) {
      this.showRecoverableErrorMessage(translatedMessage);
    } else {
      this.routeToErrorPage(translatedMessage);
    }
  }

  private showRecoverableErrorMessage(_message: string): void {
    // TODO show error notification
  }

  private routeToErrorPage(message?: string): void {
    // sometimes, the error handler is not yet tied to the Angular zone, so we make sure it is run *within* the angular zone.
    this.zone.run(() => {
      void this.router.navigate([Page.Error], {queryParams: {[routeParamConstants.ERROR]: message}, skipLocationChange: true});
    });
  }
}
