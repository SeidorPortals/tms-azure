import { TestBed } from '@angular/core/testing';

import { CustomerChargeService } from './customer-charge.service';

describe('CustomerChargeService', () => {
  let service: CustomerChargeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerChargeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
