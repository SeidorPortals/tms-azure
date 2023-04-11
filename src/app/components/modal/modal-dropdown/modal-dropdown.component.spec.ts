import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDropdownComponent } from './modal-dropdown.component';

describe('ModalDropdownComponent', () => {
  let component: ModalDropdownComponent;
  let fixture: ComponentFixture<ModalDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
