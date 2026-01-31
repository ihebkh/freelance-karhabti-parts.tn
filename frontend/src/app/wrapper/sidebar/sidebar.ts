import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicCarService } from '../../services/public-car-service';
import { CarBrand } from '../../models/CarBrand';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  brandsWithUrl: { brand: CarBrand, fullLogoUrl?: string }[] = [];
  isLoading: boolean = true;
  showBrandsDropdown: boolean = false;

  constructor(
    private publicService: PublicCarService,
    private router: Router,
    public authService: AuthService
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
    this.showBrandsDropdown = false;
  }

  onBrandsMenuEnter(): void {
    this.showBrandsDropdown = true;
  }

  onBrandsMenuLeave(): void {
    this.showBrandsDropdown = false;
  }
}