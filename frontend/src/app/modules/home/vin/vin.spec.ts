import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vin } from './vin';

describe('Vin', () => {
  let component: Vin;
  let fixture: ComponentFixture<Vin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Vin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
