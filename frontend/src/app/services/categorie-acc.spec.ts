import { TestBed } from '@angular/core/testing';

import { CategorieAccService } from './categorie-acc';

describe('CategorieAcc', () => {
  let service: CategorieAccService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorieAccService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
