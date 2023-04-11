import { TestBed } from '@angular/core/testing';

import { EquipmentTypeServiceService } from './equipment-type-service.service';

describe('EquipmentTypeServiceService', () => {
  let service: EquipmentTypeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentTypeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
