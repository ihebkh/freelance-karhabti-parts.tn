import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../models/Category';
import { PublicCategoryService } from '../../../services/public-category-service';
import { PublicCarService } from '../../../services/public-car-service';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  categories: { category: Category, fullImageUrl?: string }[] = [];
  isLoading: boolean = true;

  constructor(
    private publicCategoryService: PublicCategoryService,
    private publicService: PublicCarService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.publicCategoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.map(c => ({
          category: c,
          fullImageUrl: c.image ? this.publicService.getImageUrl(c.image) : undefined
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.isLoading = false;
      }
    });
  }

  toSubCategory(categoryId: number): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/cars/categories', categoryId, 'subcategories']);
    } else {
      this.router.navigate(['/cars/categories', categoryId, 'subcategories']);
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
