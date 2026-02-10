import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsHeader } from './brands-header';

describe('BrandsHeader', () => {
  let component: BrandsHeader;
  let fixture: ComponentFixture<BrandsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandsHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandsHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
