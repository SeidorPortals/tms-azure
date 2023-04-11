import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperOWLComponent } from './shipper-owl.component';

describe('ShipperOWLComponent', () => {
  let component: ShipperOWLComponent;
  let fixture: ComponentFixture<ShipperOWLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipperOWLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipperOWLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
