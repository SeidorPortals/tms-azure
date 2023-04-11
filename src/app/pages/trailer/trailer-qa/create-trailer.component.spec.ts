import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateTrailerComponent } from './create-trailer.component';


describe('CreateTrailerComponent', () => {
  let component: CreateTrailerComponent;
  let fixture: ComponentFixture<CreateTrailerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrailerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
