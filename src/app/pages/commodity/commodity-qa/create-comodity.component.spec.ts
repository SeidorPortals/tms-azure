import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateComodityComponent } from './create-comodity.component';

describe('CreateComodityComponent', () => {
  let component: CreateComodityComponent;
  let fixture: ComponentFixture<CreateComodityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateComodityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
