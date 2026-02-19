import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-welcome',
  standalone: false,
  templateUrl: './modal-welcome.html',
  styleUrl: './modal-welcome.css',
})
export class ModalWelcome {
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }

}
