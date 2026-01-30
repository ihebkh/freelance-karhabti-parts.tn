import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileSidebar } from './mobile-sidebar';

describe('MobileSidebar', () => {
  let component: MobileSidebar;
  let fixture: ComponentFixture<MobileSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MobileSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
