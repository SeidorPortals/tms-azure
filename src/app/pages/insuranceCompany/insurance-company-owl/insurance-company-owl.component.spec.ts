import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCompanyOwlComponent } from './insurance-company-owl.component';

describe('InsuranceCompanyOwlComponent', () => {
  let component: InsuranceCompanyOwlComponent;
  let fixture: ComponentFixture<InsuranceCompanyOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceCompanyOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceCompanyOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
