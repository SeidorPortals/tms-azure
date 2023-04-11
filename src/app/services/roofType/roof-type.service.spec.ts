import { TestBed } from '@angular/core/testing';

import { RoofTypeService } from './roof-type.service';

describe('RoofTypeService', () => {
  let service: RoofTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoofTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
