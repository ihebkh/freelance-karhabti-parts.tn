import { TestBed } from '@angular/core/testing';

import { DesignationpartService } from './designationpart-service';

describe('DesignationpartService', () => {
  let service: DesignationpartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignationpartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
