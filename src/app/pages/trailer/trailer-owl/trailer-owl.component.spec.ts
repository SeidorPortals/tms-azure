import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerOwlComponent } from './trailer-owl.component';

describe('TrailerOwlComponent', () => {
  let component: TrailerOwlComponent;
  let fixture: ComponentFixture<TrailerOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailerOwlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
