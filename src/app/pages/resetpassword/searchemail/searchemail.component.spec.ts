import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchemailComponent } from './searchemail.component';

describe('SearchemailComponent', () => {
  let component: SearchemailComponent;
  let fixture: ComponentFixture<SearchemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchemailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
