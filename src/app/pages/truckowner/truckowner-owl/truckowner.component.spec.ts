import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TruckownerComponent } from './truckowner.component';

describe('TruckownerComponent', () => {
  let component: TruckownerComponent;
  let fixture: ComponentFixture<TruckownerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckownerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
