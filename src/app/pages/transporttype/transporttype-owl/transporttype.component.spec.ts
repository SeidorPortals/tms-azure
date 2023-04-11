import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporttypeComponent } from './transporttype.component';

describe('TransporttypeComponent', () => {
  let component: TransporttypeComponent;
  let fixture: ComponentFixture<TransporttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransporttypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransporttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
