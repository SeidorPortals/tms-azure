import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOwlComponent } from './user-owl.component';

describe('UserOwlComponent', () => {
  let component: UserOwlComponent;
  let fixture: ComponentFixture<UserOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
