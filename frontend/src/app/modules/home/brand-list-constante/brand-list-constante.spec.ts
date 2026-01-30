import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandListConstante } from './brand-list-constante';

describe('BrandListConstante', () => {
  let component: BrandListConstante;
  let fixture: ComponentFixture<BrandListConstante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandListConstante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandListConstante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
