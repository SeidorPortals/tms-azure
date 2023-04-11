import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RooftypeOwlComponent } from './rooftype-owl.component';

describe('RooftypeOwlComponent', () => {
  let component: RooftypeOwlComponent;
  let fixture: ComponentFixture<RooftypeOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RooftypeOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RooftypeOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
