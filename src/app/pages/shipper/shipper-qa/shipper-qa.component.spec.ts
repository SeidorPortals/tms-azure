import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperQAComponent } from './shipper-qa.component';

describe('ShipperQAComponent', () => {
  let component: ShipperQAComponent;
  let fixture: ComponentFixture<ShipperQAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipperQAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipperQAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
