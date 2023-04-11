import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrowtypeOwlComponent } from './scrowtype-owl.component';

describe('ScrowtypeOwlComponent', () => {
  let component: ScrowtypeOwlComponent;
  let fixture: ComponentFixture<ScrowtypeOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrowtypeOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrowtypeOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
