import { TestBed } from '@angular/core/testing';

import { ScrowtypeService } from './scrowtype.service';

describe('ScrowtypeService', () => {
  let service: ScrowtypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrowtypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
