import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsigneeQAComponent } from './consignee-qa.component';

describe('ConsigneeQAComponent', () => {
  let component: ConsigneeQAComponent;
  let fixture: ComponentFixture<ConsigneeQAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsigneeQAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsigneeQAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
