import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerTypeQaComponent } from './trailer-type-qa.component';

describe('TrailerTypeQaComponent', () => {
  let component: TrailerTypeQaComponent;
  let fixture: ComponentFixture<TrailerTypeQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailerTypeQaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailerTypeQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
