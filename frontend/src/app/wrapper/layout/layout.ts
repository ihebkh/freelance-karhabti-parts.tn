import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { CartItem } from '../../models/CartItem';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-layout',
  standalone: false, // ← Ceci est correct, gardez standalone: false
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class Layout implements OnInit {
  cartItems: CartItem[] = [];
  isMobile: boolean = false;

  constructor(
    public authService: AuthService,
    private cartService: CartService
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.cartService.cart$.subscribe(items => this.cartItems = items);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }
}
