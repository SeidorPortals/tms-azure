import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTypeQaComponent } from './driver-type-qa.component';

describe('DriverTypeQaComponent', () => {
  let component: DriverTypeQaComponent;
  let fixture: ComponentFixture<DriverTypeQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverTypeQaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverTypeQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
