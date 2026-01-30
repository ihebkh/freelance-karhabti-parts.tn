import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Welcomebar } from './welcomebar';

describe('Welcomebar', () => {
  let component: Welcomebar;
  let fixture: ComponentFixture<Welcomebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Welcomebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Welcomebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
