import {TestBed} from '@angular/core/testing';
import {DataInventoryService} from './data-inventory.service';

describe('DataInventoryService', () => {
  let service: DataInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
