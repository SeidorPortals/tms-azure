import { TestBed } from '@angular/core/testing';

import { TruckServiceService } from './truck-service.service';

describe('TruckServiceService', () => {
  let service: TruckServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TruckServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
