import { TestBed } from '@angular/core/testing';

import { PaybasisService } from './paybasis.service';

describe('PaybasisService', () => {
  let service: PaybasisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaybasisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
