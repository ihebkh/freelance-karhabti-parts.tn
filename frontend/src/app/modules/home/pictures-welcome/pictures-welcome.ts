import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-pictures-welcome',
  standalone: false,
  templateUrl: './pictures-welcome.html',
  styleUrl: './pictures-welcome.css',
})
export class PicturesWelcome implements OnInit, OnDestroy {
  currentSlide = 0;
  totalSlides = 3;
  autoPlayInterval: any;
  autoPlayDuration = 5000; // 5 seconds

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
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
    // Reset auto play
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