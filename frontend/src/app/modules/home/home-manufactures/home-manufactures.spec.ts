import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeManufactures } from './home-manufactures';

describe('HomeManufactures', () => {
  let component: HomeManufactures;
  let fixture: ComponentFixture<HomeManufactures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeManufactures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeManufactures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
