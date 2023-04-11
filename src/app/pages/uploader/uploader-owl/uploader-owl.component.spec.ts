import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderOwlComponent } from './uploader-owl.component';

describe('UploaderOwlComponent', () => {
  let component: UploaderOwlComponent;
  let fixture: ComponentFixture<UploaderOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploaderOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploaderOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
