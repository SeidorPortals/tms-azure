import { TestBed } from '@angular/core/testing';

import { TrailerTypeService } from './trailer-type.service';

describe('TrailerTypeService', () => {
  let service: TrailerTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrailerTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
