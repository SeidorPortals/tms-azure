import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EquipmentTypeConfigOWLComponent } from './equipment-type-config-owl.component';

describe('EquipmentTypeConfigOWLComponent', () => {
  let component: EquipmentTypeConfigOWLComponent;
  let fixture: ComponentFixture<EquipmentTypeConfigOWLComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentTypeConfigOWLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentTypeConfigOWLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
