import { TestBed } from '@angular/core/testing';

import { ConsigneeaddressService } from './consigneeaddress.service';

describe('ConsigneeaddressService', () => {
  let service: ConsigneeaddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsigneeaddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
