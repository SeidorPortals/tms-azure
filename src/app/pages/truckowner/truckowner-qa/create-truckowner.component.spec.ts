import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateTruckownerComponent } from './create-truckowner.component';

describe('CreateTruckownerComponent', () => {
  let component: CreateTruckownerComponent;
  let fixture: ComponentFixture<CreateTruckownerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTruckownerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTruckownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
