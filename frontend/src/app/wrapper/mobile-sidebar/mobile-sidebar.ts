import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { CarPartsService } from '../../services/car-parts-service';
import { PublicCarService } from '../../services/public-car-service';
import { CartService } from '../../services/cart-service';
import { CarPart } from '../../models/CarPart';

@Component({
  selector: 'app-mobile-sidebar',
  standalone: false,
  templateUrl: './mobile-sidebar.html',
  styleUrl: './mobile-sidebar.css',
})
export class MobileSidebar implements OnInit {
  // Menu state
  isMenuOpen: boolean = false;

  // Modal state (pour les détails des pièces)
  selectedPart?: CarPart;
  selectedPartUrl?: string;
  quantityToAdd: number = 1;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router,
    private modalService: NgbModal,
    private partService: CarPartsService,
    private publicCarService: PublicCarService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    // Composant simplifié sans recherche
  }

  // ========================================
  // MENU METHODS
  // ========================================

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  logout() {
    this.closeMenu();
    this.userService.logout();
    this.router.navigate(['/auth/signin']);
  }

  // ========================================
  // PART DETAILS METHODS
  // ========================================

  openPartDetails(content: any, part: CarPart) {
    this.quantityToAdd = 1;
    this.selectedPart = part;

    if (part.id) {
      this.partService.getPart(part.id).subscribe({
        next: (detailedPart) => {
          this.selectedPart = detailedPart;
          this.selectedPartUrl = detailedPart.image
            ? this.publicCarService.getImageUrl(detailedPart.image)
            : undefined;

          // Ouvrir le modal
          this.modalService.open(content, {
            centered: true,
            size: 'lg'
          });
        },
        error: (err) => {
          console.error('Erreur lors du chargement des détails:', err);
        }
      });
    }
  }

  addToCart(part: CarPart, quantity: number) {
    if (this.selectedPart) {
      this.cartService.addItem(this.selectedPart, quantity);
    }
  }

  getPartImageUrl(imageName?: string): string | undefined {
    return imageName ? this.publicCarService.getImageUrl(imageName) : undefined;
  }
}
