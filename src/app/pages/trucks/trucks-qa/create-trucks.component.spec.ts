import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateTrucksComponent } from './create-trucks.component';

describe('CreateTrucksComponent', () => {
  let component: CreateTrucksComponent;
  let fixture: ComponentFixture<CreateTrucksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrucksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrucksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 