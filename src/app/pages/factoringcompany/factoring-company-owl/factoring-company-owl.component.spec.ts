import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoringCompanyOwlComponent } from './factoring-company-owl.component';

describe('FactoringCompanyOwlComponent', () => {
  let component: FactoringCompanyOwlComponent;
  let fixture: ComponentFixture<FactoringCompanyOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactoringCompanyOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactoringCompanyOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
