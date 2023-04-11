import { TestBed } from '@angular/core/testing';

import { CarrierscostService } from './carrierscost.service';

describe('CarrierscostService', () => {
  let service: CarrierscostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarrierscostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
