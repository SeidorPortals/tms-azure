import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DriversComponent } from './drivers.component';

describe('DriversComponent', () => {
  let component: DriversComponent;
  let fixture: ComponentFixture<DriversComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 // it('should create', () => {
   // expect(component).toBeTruthy();
 // });
});
function beforeEach(arg0: (done: any) => any) {
  throw new Error('Function not implemented.');
}

function expect(component: DriversComponent) {
  throw new Error('Function not implemented.');
}

