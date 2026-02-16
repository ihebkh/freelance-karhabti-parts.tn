import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PublicCarService } from '../../../services/public-car-service';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-pictures-welcome',
  standalone: false,
  templateUrl: './pictures-welcome.html',
  styleUrl: './pictures-welcome.css',
})
export class PicturesWelcome implements OnInit, OnDestroy {
  vinNumber: string = '';
  isSearching: boolean = false;

  currentSlide = 0;
  totalSlides = 3;
  autoPlayInterval: any;
  autoPlayDuration = 5000;

  constructor(
    private publicCarService: PublicCarService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  searchByVin() {
    const query = this.vinNumber.trim().toUpperCase();

    if (!query) {
      alert('Veuillez entrer un numéro VIN');
      return;
    }

    this.isSearching = true;

    this.publicCarService.lookupVin(query).subscribe({
      next: (res: any) => {
        this.isSearching = false;

        const isAdmin = this.authService.isAdmin();
        const base = isAdmin ? '/admin/cars' : '/cars';

        let targetUrl = '';
        if (res.type === 'brand') {
          targetUrl = `${base}/brands/${res.id}/models`;
        } else if (res.type === 'generation') {
          targetUrl = `${base}/generations/${res.id}/parts`;
        } else {
          targetUrl = `${base}/models/${res.id}/generations`;
        }

        this.router.navigate([targetUrl]);
        this.vinNumber = '';
      },
      error: (err) => {
        this.isSearching = false;
        const errorMsg = err.error?.message || "VIN non trouvé ou marque non supportée.";
        alert(errorMsg);
      }
    });
  }

  onEnterPress() {
    this.searchByVin();
  }

  startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDuration);
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlides();
  }

  previousSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlides();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.updateSlides();
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  private updateSlides(): void {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    slides.forEach((slide, index) => {
      if (index === this.currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, index) => {
      if (index === this.currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}