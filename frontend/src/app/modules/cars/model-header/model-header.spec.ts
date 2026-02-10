import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelHeader } from './model-header';

describe('ModelHeader', () => {
  let component: ModelHeader;
  let fixture: ComponentFixture<ModelHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
