import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertHome } from './alert-home';

describe('AlertHome', () => {
  let component: AlertHome;
  let fixture: ComponentFixture<AlertHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
