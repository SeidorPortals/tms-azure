import { TestBed } from '@angular/core/testing';

import { SessionmodalService } from './sessionmodal.service';

describe('SessionmodalService', () => {
  let service: SessionmodalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionmodalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
