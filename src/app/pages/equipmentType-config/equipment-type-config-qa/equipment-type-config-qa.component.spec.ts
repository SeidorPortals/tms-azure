import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EquipmentTypeConfigQAComponent } from './equipment-type-config-qa.component';

describe('EquipmentTypeConfigQAComponent', () => {
  let component: EquipmentTypeConfigQAComponent;
  let fixture: ComponentFixture<EquipmentTypeConfigQAComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentTypeConfigQAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentTypeConfigQAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
