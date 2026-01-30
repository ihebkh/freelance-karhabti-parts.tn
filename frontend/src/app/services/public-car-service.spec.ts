import { TestBed } from '@angular/core/testing';

import { PublicCarService } from './public-car-service';

describe('PublicCarService', () => {
  let service: PublicCarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicCarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
