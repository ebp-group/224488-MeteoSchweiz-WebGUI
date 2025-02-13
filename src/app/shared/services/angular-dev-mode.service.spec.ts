import {isDevMode} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {AngularDevModeService} from './angular-dev-mode.service';

describe('AngularDevModeService', () => {
  let service: AngularDevModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularDevModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a value indicating whether the dev mode is active or not', () => {
    const expected = isDevMode();

    const actual = service.isDevMode();

    expect(actual).toBe(expected);
  });
});
