import { TestBed } from '@angular/core/testing';

import { CommodityServiceService } from './commodity-service.service';

describe('CommodityServiceService', () => {
  let service: CommodityServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommodityServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
