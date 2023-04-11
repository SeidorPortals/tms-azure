import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytypeQaComponent } from './paytype-qa.component';

describe('PaytypeQaComponent', () => {
  let component: PaytypeQaComponent;
  let fixture: ComponentFixture<PaytypeQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaytypeQaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaytypeQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
