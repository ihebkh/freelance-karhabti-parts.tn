import { Component, OnInit, TemplateRef } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Category } from '../../../models/Category';
import { SubCategory } from '../../../models/SubCategory';
import { CarPart } from '../../../models/CarPart';
import { CarGeneration } from '../../../models/CarGeneration';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PublicCategoryService } from '../../../services/public-category-service';
import { AuthService } from '../../../services/auth-service';
import { CarPartsService } from '../../../services/car-parts-service';
import { PublicCarService } from '../../../services/public-car-service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../../services/cart-service';
import { DesignationService } from '../../../services/designation-service';

@Component({
  selector: 'app-parts-on-sale',
  standalone: false,
  templateUrl: './parts-on-sale.html',
  styleUrl: './parts-on-sale.css',
})
export class PartsOnSale implements OnInit {


  selectedPartUrl?: string;
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  currentPage = 0;
  totalPages = 0;
  isSubcategoryContext = false;
  isGenerationContext = false;
  isGlobalContext = true;

  categories: Category[] = [];
  subCategories: SubCategory[] = [];

  selectedPart?: CarPart;
  quantityToAdd = 1;
  partsWithUrl: { parts: CarPart, fullLogoUrl?: string }[] = [];
  generations: CarGeneration[] = [];


  constructor(
    private publicCategoryService: PublicCategoryService,
    public authService: AuthService,
    private partService: CarPartsService,
    private publicCarService: PublicCarService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private cartService: CartService,
  ) {

  }

  ngOnInit() {

    this.loadParts();
  }

  loadParts(page: number = this.currentPage) {
    this.currentPage = page;
    let obs$;

    // Pass desId to all context-based calls
    this.partService.getAllPartsOnSale(page).subscribe(data => {
      this.totalPages = data.totalPages;
      this.partsWithUrl = data.content.map(p => ({
        parts: p,
        fullLogoUrl: p.image ? this.publicCarService.getImageUrl(p.image) : undefined
      }));
    });
  }
  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
  openUserModal(content: TemplateRef<any>, part: CarPart) {
    this.quantityToAdd = 1;
    this.selectedPartUrl = undefined;
    this.selectedPart = part;
    if (part.id) {
      this.partService.getPart(part.id).subscribe(detailedPart => {
        this.selectedPart = detailedPart;
        this.selectedPartUrl = detailedPart.image
          ? this.publicCarService.getImageUrl(detailedPart.image)
          : undefined;
      });
    }

    this.modalService.open(content, { centered: true, size: 'lg' });
  }
  addToCart(part: CarPart, quantity: number) {
    if (part) {
      this.cartService.addItem(part, quantity);
    }
  }

}
