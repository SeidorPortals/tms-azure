import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateShipmentComponent } from './create-shipment.component';

describe('CreateShipmentComponent', () => {
  let component: CreateShipmentComponent;
  let fixture: ComponentFixture<CreateShipmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
