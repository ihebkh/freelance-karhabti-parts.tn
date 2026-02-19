import { Component, OnInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { CarPart } from '../../../models/CarPart';
import { AccPart } from '../../../models/AccPart';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth-service';
import { CarPartsService } from '../../../services/car-parts-service';
import { AccPartsService } from '../../../services/acc-parts-service';
import { PublicCarService } from '../../../services/public-car-service';
import { CartService } from '../../../services/cart-service';

// Vue unifiée pour pièces et accessoires en promo
interface SaleItem {
  id?: number;
  name: string;
  price: number;
  priceAfterSale: number;
  onSale: boolean;
  salePercentage: number;
  inStock: boolean;
  image?: string;
  categoryLabel?: string;
  subCategoryLabel?: string;
  designationName: string;
  reference: string;
  original: CarPart | AccPart;
}

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
  selectedPart?: SaleItem;
  quantityToAdd = 1;
  partsWithUrl: { parts: SaleItem, fullLogoUrl?: string }[] = [];
  carPartsWithUrl: { parts: SaleItem, fullLogoUrl?: string }[] = [];
  accPartsWithUrl: { parts: SaleItem, fullLogoUrl?: string }[] = [];


  constructor(
    public authService: AuthService,
    private partService: CarPartsService,
    private accPartService: AccPartsService,
    private publicCarService: PublicCarService,
    private modalService: NgbModal,
    private cartService: CartService,
  ) {

  }

  ngOnInit() {

    this.loadParts();
  }

  loadParts(page: number = this.currentPage) {
    this.currentPage = page;
    this.partService.getAllPartsOnSale(page).subscribe(carData => {
      this.accPartService.getAllPartsOnSale(page).subscribe(accData => {
        this.totalPages = Math.max(carData.totalPages, accData.totalPages);

        const carItems: { parts: SaleItem; fullLogoUrl?: string }[] = carData.content.map((p: CarPart) => ({
          parts: {
            id: p.id,
            name: p.name,
            price: p.price,
            priceAfterSale: p.priceAfterSale,
            onSale: p.onSale,
            salePercentage: p.salePercentage,
            inStock: p.inStock,
            image: p.image,
            categoryLabel: p.categoryName ?? undefined,
            subCategoryLabel: p.subCategoryName ?? undefined,
            designationName: p.designationName,
            reference: p.reference,
            original: p,
          },
          fullLogoUrl: p.image ? this.publicCarService.getImageUrl(p.image) : undefined,
        }));

        const accItems: { parts: SaleItem; fullLogoUrl?: string }[] = accData.content.map((a: AccPart) => ({
          parts: {
            id: a.id,
            name: a.name,
            price: a.price,
            priceAfterSale: a.priceAfterSale,
            onSale: a.onSale,
            salePercentage: a.salePercentage,
            inStock: a.inStock,
            image: a.image,
            categoryLabel: a.categoryAccName ?? undefined,
            subCategoryLabel: undefined,
            designationName: a.designationName,
            reference: a.reference,
            original: a,
          },
          fullLogoUrl: a.image ? this.publicCarService.getImageUrl(a.image) : undefined,
        }));

        this.carPartsWithUrl = carItems;
        this.accPartsWithUrl = accItems;
        this.partsWithUrl = [...carItems, ...accItems];
      });
    });
  }
  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
  openUserModal(content: TemplateRef<any>, part: SaleItem) {
    this.quantityToAdd = 1;
    this.selectedPartUrl = undefined;
    this.selectedPart = part;

    if (part.image) {
      this.selectedPartUrl = this.publicCarService.getImageUrl(part.image);
    } else {
      this.selectedPartUrl = undefined;
    }

    this.modalService.open(content, { centered: true, size: 'lg' });
  }
  addToCart(part: SaleItem, quantity: number) {
    if (part && part.original) {
      this.cartService.addItem(part.original, quantity);
    }
  }

}
