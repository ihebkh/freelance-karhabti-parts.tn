import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsOnSale } from './parts-on-sale';

describe('PartsOnSale', () => {
  let component: PartsOnSale;
  let fixture: ComponentFixture<PartsOnSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartsOnSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsOnSale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
