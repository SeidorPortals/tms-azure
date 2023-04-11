import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RooftypeQaComponent } from './rooftype-qa.component';

describe('RooftypeQaComponent', () => {
  let component: RooftypeQaComponent;
  let fixture: ComponentFixture<RooftypeQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RooftypeQaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RooftypeQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
