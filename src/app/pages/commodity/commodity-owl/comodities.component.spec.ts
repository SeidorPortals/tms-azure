import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComoditiesComponent } from './comodities.component';

describe('ComoditiesComponent', () => {
  let component: ComoditiesComponent;
  let fixture: ComponentFixture<ComoditiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComoditiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComoditiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
