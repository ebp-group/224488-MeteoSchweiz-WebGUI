import {TestBed} from '@angular/core/testing';
import {StacService} from './stac.service';

describe('AngularDevModeService', () => {
  let service: StacService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StacService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
