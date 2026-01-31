import {Component, Input, OnInit} from '@angular/core';
import {CartItem} from '../../models/CartItem';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CartService} from '../../services/cart-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OrdersService} from '../../services/orders-service';
import {AuthService} from '../../services/auth-service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import {CarPart} from '../../models/CarPart';
import {CarPartsService} from '../../services/car-parts-service';
import {PublicCarService} from '../../services/public-car-service';
import {UserService} from '../../services/user-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar implements OnInit {
  isMenuOpen = false;
  selectedPart?: CarPart;
  selectedPartUrl?: string;
  quantityToAdd: number = 1;
  searchQuery: string = '';
  searchResults: CarPart[] = [];
  isSearching: boolean = false;
  private searchSubject = new Subject<string>();
  @Input() cart: CartItem[] = [];
  orderForm: FormGroup;
  searchMode: 'PART' | 'VIN' = 'PART';
  
  constructor(
    private cartService: CartService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private ordersService: OrdersService,
    public authService: AuthService,
    private partService: CarPartsService,
    private publicCarService: PublicCarService,
    public userService: UserService,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      deliveryAddress: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.trim().length > 1) {
        this.isSearching = true;
        this.partService.searchParts(query, 0).subscribe(res => {
          this.searchResults = res.content;
          this.isSearching = false;
        });
      } else {
        this.searchResults = [];
      }
    });
  }

  openCartModal(content: any) {
    this.modalService.open(content, {
      windowClass: 'cart-modal-wrapper',
      centered: true,
      size: 'lg'
    });
  }

  removeItem(partId: number) {
    this.cartService.removeItem(partId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  submitOrder(email: string, modal: any) {
    const request = {
      items: this.cart.map(item => ({
        partId: item.part.id,
        quantity: Number(item.quantity)
      })),
      ...this.orderForm.value
    };

    this.ordersService.createOrder(email, request).subscribe(() => {
      this.cartService.clearCart();
      modal.close();
      alert('Order placed successfully!');
    });
  }

  getCartTotal(): number {
    return this.cart?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) || 0;
  }

  onSearchInput(val: string) {
    this.searchQuery = val;
    if (this.searchMode === 'PART') {
      this.searchSubject.next(val);
    } else {
      this.searchResults = [];
    }
  }

  handleSearchEnter() {
    const query = this.searchQuery.trim();
    if (!query) return;

    if (this.searchMode === 'VIN') {
      this.isSearching = true;
      this.publicCarService.lookupVin(query).subscribe({
        next: (res: any) => {
          this.isSearching = false;
          const isAdmin = this.authService.isAdmin();
          const base = isAdmin ? '/admin/cars' : '/cars';
          const targetUrl = res.type === 'brand'
            ? `${base}/brands/${res.id}/models`
            : `${base}/models/${res.id}/generations`;
          this.router.navigate([targetUrl]);
          this.clearSearch();
        },
        error: (err) => {
          this.isSearching = false;
          const errorMsg = err.error?.message || "VIN non trouvé ou marque non supportée.";
          alert(errorMsg);
        }
      });
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
  }

  openPartDetails(content: any, part: CarPart) {
    this.quantityToAdd = 1;
    this.selectedPart = part;
    this.searchResults = [];
    this.searchQuery = '';

    if (part.id) {
      this.partService.getPart(part.id).subscribe(detailedPart => {
        this.selectedPart = detailedPart;
        this.selectedPartUrl = detailedPart.image
          ? this.publicCarService.getImageUrl(detailedPart.image)
          : undefined;

        this.modalService.open(content, { centered: true, size: 'lg' });
      });
    }
  }

  addToCart(part: CarPart, quantity: number) {
    if (this.selectedPart) {
      this.cartService.addItem(this.selectedPart, Number(quantity));
    }
  }

  getCartTotalPrice(): number {
    if (!this.cart || this.cart.length === 0) return 0;
    return this.cart.reduce((total, item) => {
      const activePrice = item.part.onSale
        ? (item.part.priceAfterSale || 0)
        : (item.part.price || 0);
      const qty = Number(item.quantity) || 0;
      return total + (activePrice * qty);
    }, 0);
  }

  getPartImageUrl(imageName?: string): string | undefined {
    return imageName ? this.publicCarService.getImageUrl(imageName) : undefined;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  handleCheckout(modal: any) {
    if (this.isLoggedIn) {
      if (this.orderForm.invalid) {
        this.orderForm.markAllAsTouched();
        return;
      }
      const email = this.authService.getEmail();
      if (email) {
        this.submitOrder(email, modal);
      }
    } else {
      modal.dismiss();
      this.router.navigate(['/auth/signin'], {
        queryParams: { returnUrl: this.router.url }
      });
    }
  }

  // Nouvelles méthodes pour le menu utilisateur
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.closeMenu();
    this.userService.logout();
    this.router.navigate(['/auth/signin']);
  }

  // Méthode pour naviguer vers la page de login
  navigateToLogin() {
    this.router.navigate(['/auth/signin'], {
      queryParams: { returnUrl: this.router.url }
    });
  }
}