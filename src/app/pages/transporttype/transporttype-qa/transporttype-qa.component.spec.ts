import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporttypeQaComponent } from './transporttype-qa.component';

describe('TransporttypeQaComponent', () => {
  let component: TransporttypeQaComponent;
  let fixture: ComponentFixture<TransporttypeQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransporttypeQaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransporttypeQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
