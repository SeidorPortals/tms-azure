import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsQaComponent } from './views-qa.component';

describe('ViewsQaComponent', () => {
  let component: ViewsQaComponent;
  let fixture: ComponentFixture<ViewsQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewsQaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewsQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
