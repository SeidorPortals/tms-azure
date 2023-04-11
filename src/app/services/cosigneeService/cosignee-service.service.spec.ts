import { TestBed } from '@angular/core/testing';

import { CosigneeServiceService } from './cosignee-service.service';

describe('CosigneeServiceService', () => {
  let service: CosigneeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CosigneeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
