import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-car-header',
    standalone: false,
    templateUrl: './car-header.html',
    styleUrl: './car-header.css',
})
export class CarHeader {
    @Input() title: string = '';
    @Input() subtitle: string = '';
}
