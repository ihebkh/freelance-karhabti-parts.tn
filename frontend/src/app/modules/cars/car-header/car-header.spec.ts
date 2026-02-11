import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarHeader } from './car-header';

describe('CarHeader', () => {
    let component: CarHeader;
    let fixture: ComponentFixture<CarHeader>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CarHeader]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CarHeader);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
