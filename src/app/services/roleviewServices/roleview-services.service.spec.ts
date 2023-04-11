import { TestBed } from '@angular/core/testing';

import { RoleviewServicesService } from './roleview-services.service';

describe('RoleviewServicesService', () => {
  let service: RoleviewServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleviewServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
