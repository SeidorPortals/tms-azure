import { TestBed } from '@angular/core/testing';

import { UserfindetailsService } from './userfindetails.service';

describe('UserfindetailsService', () => {
  let service: UserfindetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserfindetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
