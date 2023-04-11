import { TestBed } from '@angular/core/testing';

import { FactoringCompanyService } from './factoring-company.service';

describe('FactoringCompanyService', () => {
  let service: FactoringCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactoringCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
