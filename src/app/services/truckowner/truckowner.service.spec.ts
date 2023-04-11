import { TestBed } from '@angular/core/testing';

import { TruckownerService } from './truckowner.service';

describe('TruckownerService', () => {
  let service: TruckownerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TruckownerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
