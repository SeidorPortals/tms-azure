import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaybasisOwlComponent } from './paybasis-owl.component';

describe('PaybasisOwlComponent', () => {
  let component: PaybasisOwlComponent;
  let fixture: ComponentFixture<PaybasisOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaybasisOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaybasisOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
