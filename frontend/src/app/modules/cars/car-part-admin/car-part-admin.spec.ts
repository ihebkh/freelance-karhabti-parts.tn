import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarPartAdmin } from './car-part-admin';

describe('CarPartAdmin', () => {
  let component: CarPartAdmin;
  let fixture: ComponentFixture<CarPartAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarPartAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarPartAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
