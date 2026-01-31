import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicturesWelcome } from './pictures-welcome';

describe('PicturesWelcome', () => {
  let component: PicturesWelcome;
  let fixture: ComponentFixture<PicturesWelcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PicturesWelcome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PicturesWelcome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
