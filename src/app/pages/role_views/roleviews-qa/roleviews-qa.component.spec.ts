import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleviewsQaComponent } from './roleviews-qa.component';

describe('RoleviewsQaComponent', () => {
  let component: RoleviewsQaComponent;
  let fixture: ComponentFixture<RoleviewsQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleviewsQaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleviewsQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
