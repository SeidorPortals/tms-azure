import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateTripComponent } from './create-trip.component';

describe('CreateTripComponent', () => {
  let component: CreateTripComponent;
  let fixture: ComponentFixture<CreateTripComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
