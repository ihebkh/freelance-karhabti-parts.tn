import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsContainer } from './cars-container';

describe('CarsContainer', () => {
  let component: CarsContainer;
  let fixture: ComponentFixture<CarsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarsContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
