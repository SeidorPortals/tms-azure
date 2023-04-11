import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsOwlComponent } from './views-owl.component';

describe('ViewsOwlComponent', () => {
  let component: ViewsOwlComponent;
  let fixture: ComponentFixture<ViewsOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewsOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewsOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
