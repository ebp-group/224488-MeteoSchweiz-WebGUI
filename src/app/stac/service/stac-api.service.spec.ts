import {TestBed} from '@angular/core/testing';
import {StacApiService} from './stac-api.service';

describe('StacApiService', () => {
  let service: StacApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StacApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
