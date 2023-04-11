import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsigneeOWLComponent } from './consignee-owl.component';

describe('ConsigneeOWLComponent', () => {
  let component: ConsigneeOWLComponent;
  let fixture: ComponentFixture<ConsigneeOWLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsigneeOWLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsigneeOWLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
