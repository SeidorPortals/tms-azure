import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateCarriersComponent } from './create-carriers.component';

describe('CreateCarriersComponent', () => {
  let component: CreateCarriersComponent;
  let fixture: ComponentFixture<CreateCarriersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCarriersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCarriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
