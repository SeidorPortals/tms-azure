import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoringCompanyQaComponent } from './factoring-company-qa.component';

describe('FactoringCompanyQaComponent', () => {
  let component: FactoringCompanyQaComponent;
  let fixture: ComponentFixture<FactoringCompanyQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactoringCompanyQaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactoringCompanyQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
