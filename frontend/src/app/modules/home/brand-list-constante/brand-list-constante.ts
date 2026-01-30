import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicCarService } from '../../../services/public-car-service';
import { CarBrand } from '../../../models/CarBrand';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-brand-list-constante',
  standalone: false,
  templateUrl: './brand-list-constante.html',
  styleUrl: './brand-list-constante.css',
})
export class BrandListConstante implements OnInit {
  brandsWithUrl: { brand: CarBrand, fullLogoUrl?: string }[] = [];
  isLoading: boolean = true;

  constructor(
    private publicService: PublicCarService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.isLoading = true;
    this.publicService.getBrands().subscribe({
      next: (data) => {
        this.brandsWithUrl = data.map(b => ({
          brand: b,
          fullLogoUrl: b.logo ? this.publicService.getImageUrl(b.logo) : undefined
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des marques:', error);
        this.isLoading = false;
      }
    });
  }

  viewModels(brandId: number): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/cars/brands', brandId, 'models']);
    } else {
      this.router.navigate(['/cars/brands', brandId, 'models']);
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
