import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCompanyQaComponent } from './insurance-company-qa.component';

describe('InsuranceCompanyQaComponent', () => {
  let component: InsuranceCompanyQaComponent;
  let fixture: ComponentFixture<InsuranceCompanyQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceCompanyQaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceCompanyQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
