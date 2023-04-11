import { TestBed } from '@angular/core/testing';

import { TransporttypeService } from './transporttype.service';

describe('TransporttypeService', () => {
  let service: TransporttypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransporttypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
