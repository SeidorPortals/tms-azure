import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesOwlComponent } from './roles-owl.component';

describe('RolesOwlComponent', () => {
  let component: RolesOwlComponent;
  let fixture: ComponentFixture<RolesOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
