import { TestBed } from '@angular/core/testing';

import { CarPartsService } from './car-parts-service';

describe('CarPartsService', () => {
  let service: CarPartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarPartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
