import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesQaComponent } from './roles-qa.component';

describe('RolesQaComponent', () => {
  let component: RolesQaComponent;
  let fixture: ComponentFixture<RolesQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesQaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
