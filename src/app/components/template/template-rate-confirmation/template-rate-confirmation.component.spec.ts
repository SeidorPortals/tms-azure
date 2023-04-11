import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateRateConfirmationComponent } from './template-rate-confirmation.component';

describe('TemplateRateConfirmationComponent', () => {
  let component: TemplateRateConfirmationComponent;
  let fixture: ComponentFixture<TemplateRateConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateRateConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateRateConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
