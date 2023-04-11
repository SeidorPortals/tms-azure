import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTypeOwlComponent } from './driver-type-owl.component';

describe('DriverTypeOwlComponent', () => {
  let component: DriverTypeOwlComponent;
  let fixture: ComponentFixture<DriverTypeOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverTypeOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverTypeOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
