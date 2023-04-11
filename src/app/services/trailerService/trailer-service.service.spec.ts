import { TestBed } from '@angular/core/testing';

import { TrailerServiceService } from './trailer-service.service';

describe('TrailerServiceService', () => {
  let service: TrailerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrailerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
