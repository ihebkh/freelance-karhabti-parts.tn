import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieaccList } from './categorieacc-list';

describe('CategorieaccList', () => {
  let component: CategorieaccList;
  let fixture: ComponentFixture<CategorieaccList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategorieaccList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorieaccList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
