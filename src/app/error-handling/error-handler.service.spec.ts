import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {TranslocoService} from '@jsverse/transloco';
import {routeParamConstants} from '../shared/constants/route-param.constants';
import {Page} from '../shared/enums/page.enum';
import {FatalError, RecoverableError, SilentError} from '../shared/errors/base.error';
import {AngularDevModeService} from '../shared/services/angular-dev-mode.service';
import {ErrorHandlerService} from './error-handler.service';

import Spy = jasmine.Spy;

class TestSilentError extends SilentError {}

class TestRecoverableError extends RecoverableError {
  constructor(message: string = '') {
    super();
    this.message = message;
  }
}

class TestFatalError extends FatalError {
  constructor(message: string = '') {
    super();
    this.message = message;
  }
}

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj<Router>(['navigate']);
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerSpyObj},
        {provide: TranslocoService, useValue: {translate: (message: string): string => message}},
      ],
    });
    service = TestBed.inject(ErrorHandlerService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handles SilentErrors correctly', () => {
    const testError = new TestSilentError();

    service.handleError(testError);

    // nothing should happen, so we check for other behaviours to NOT have been called.
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('handles RecoverableErrors correctly', () => {
    const testErrorMessage = 'error message';
    const testError = new TestRecoverableError(testErrorMessage);

    service.handleError(testError);

    // TODO test if the error notification was shown
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('handles FatalErrors correctly', () => {
    const testErrorMessage = 'error message';
    const testError = new TestFatalError(testErrorMessage);

    service.handleError(testError);

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith([Page.Error], {
      queryParams: {[routeParamConstants.ERROR]: testErrorMessage},
      skipLocationChange: true,
    });
  });

  it('handles non OpendataExplorerRuntimeErrors correctly', () => {
    const testErrorMessage = 'error message';
    const testError = new Error(testErrorMessage);

    service.handleError(testError);

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith([Page.Error], {
      queryParams: {[routeParamConstants.ERROR]: testErrorMessage},
      skipLocationChange: true,
    });
  });

  describe('logging', () => {
    let angularIsDevModeSpy: Spy<() => boolean>;

    beforeEach(() => {
      const angularDevModeService = TestBed.inject(AngularDevModeService);
      angularIsDevModeSpy = spyOn(angularDevModeService, 'isDevMode');
    });

    it('does not log if isDevMode() === false', () => {
      angularIsDevModeSpy.and.returnValue(false);
      const testError = new TestSilentError();

      service.handleError(testError);

      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('logs a non-OpendataExplorerRuntimeError to the console', () => {
      angularIsDevModeSpy.and.returnValue(true);
      const testError = new Error();

      service.handleError(testError);

      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledOnceWith(testError);
    });

    it('logs a OpendataExplorerRuntimeError to the console if it has no wrapped error', () => {
      angularIsDevModeSpy.and.returnValue(true);
      const testError = new TestSilentError();

      service.handleError(testError);

      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledOnceWith(testError);
    });

    it('logs a OpendataExplorerRuntimeError to the console and also logs a wrapped error', () => {
      angularIsDevModeSpy.and.returnValue(true);
      const testWrappedError = new Error('Test Error in Wrap');
      const testError = new TestSilentError(testWrappedError);

      service.handleError(testError);

      expect(console.error).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenCalledWith(testError);
      expect(console.error).toHaveBeenCalledWith('Original error was:', testWrappedError);
    });
  });
});
