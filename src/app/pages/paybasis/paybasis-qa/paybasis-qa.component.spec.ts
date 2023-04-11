import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaybasisQaComponent } from './paybasis-qa.component';

describe('PaybasisQaComponent', () => {
  let component: PaybasisQaComponent;
  let fixture: ComponentFixture<PaybasisQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaybasisQaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaybasisQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
