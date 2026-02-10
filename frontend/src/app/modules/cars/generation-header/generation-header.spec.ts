import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationHeader } from './generation-header';

describe('GenerationHeader', () => {
  let component: GenerationHeader;
  let fixture: ComponentFixture<GenerationHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerationHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerationHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
