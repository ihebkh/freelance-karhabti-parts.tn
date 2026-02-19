import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccPartAdmin } from './acc-part-admin';

describe('AccPartAdmin', () => {
  let component: AccPartAdmin;
  let fixture: ComponentFixture<AccPartAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccPartAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccPartAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
