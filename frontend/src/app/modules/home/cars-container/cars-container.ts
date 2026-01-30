import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicCarService } from '../../../services/public-car-service';
import { CarBrand } from '../../../models/CarBrand';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-cars-container',
  standalone: false,
  templateUrl: './cars-container.html',
  styleUrl: './cars-container.css',
})
export class CarsContainer implements OnInit {
  brandsWithUrl: { brand: CarBrand, fullLogoUrl?: string }[] = [];

  constructor(
    private publicService: PublicCarService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.publicService.getBrands().subscribe(data => {
      this.brandsWithUrl = data.map(b => ({
        brand: b,
        fullLogoUrl: b.logo ? this.publicService.getImageUrl(b.logo) : undefined
      }));
    });
  }

  viewModels(brandId: number) {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/cars/brands', brandId, 'models']);
    } else {
      this.router.navigate(['/cars/brands', brandId, 'models']);
    }
  }
}
