import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleviewsOwlComponent } from './roleviews-owl.component';

describe('RoleviewsOwlComponent', () => {
  let component: RoleviewsOwlComponent;
  let fixture: ComponentFixture<RoleviewsOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleviewsOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleviewsOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
