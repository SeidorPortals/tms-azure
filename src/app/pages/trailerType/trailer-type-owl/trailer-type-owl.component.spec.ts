import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerTypeOwlComponent } from './trailer-type-owl.component';

describe('TrailerTypeOwlComponent', () => {
  let component: TrailerTypeOwlComponent;
  let fixture: ComponentFixture<TrailerTypeOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailerTypeOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailerTypeOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
