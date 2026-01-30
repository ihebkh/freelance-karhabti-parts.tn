import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationList } from './generation-list';

describe('GenerationList', () => {
  let component: GenerationList;
  let fixture: ComponentFixture<GenerationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerationList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerationList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
