import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrowtypeQaComponent } from './scrowtype-qa.component';

describe('ScrowtypeQaComponent', () => {
  let component: ScrowtypeQaComponent;
  let fixture: ComponentFixture<ScrowtypeQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrowtypeQaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrowtypeQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
