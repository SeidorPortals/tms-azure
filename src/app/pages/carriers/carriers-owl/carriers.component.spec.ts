import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CarriersComponent } from './carriers.component';

describe('CarriersComponent', () => {
  let component: CarriersComponent;
  let fixture: ComponentFixture<CarriersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CarriersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
