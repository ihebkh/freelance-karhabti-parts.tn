import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWelcome } from './modal-welcome';

describe('ModalWelcome', () => {
  let component: ModalWelcome;
  let fixture: ComponentFixture<ModalWelcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalWelcome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalWelcome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
