import { TestBed } from '@angular/core/testing';

import { DriverTypeServiceService } from './driver-type-service.service';

describe('DriverTypeServiceService', () => {
  let service: DriverTypeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverTypeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
