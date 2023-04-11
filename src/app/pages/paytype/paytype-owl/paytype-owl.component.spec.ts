import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytypeOwlComponent } from './paytype-owl.component';

describe('PaytypeOwlComponent', () => {
  let component: PaytypeOwlComponent;
  let fixture: ComponentFixture<PaytypeOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaytypeOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaytypeOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
