import { Component, OnInit, TemplateRef } from '@angular/core';
import { DesignationPart } from '../../../models/DesignationPart';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AccPart } from '../../../models/AccPart';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth-service';
import { AccPartsService } from '../../../services/acc-parts-service';
import { PublicCarService } from '../../../services/public-car-service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../../services/cart-service';
import { DesignationPartService } from '../../../services/designationpart-service';

@Component({
  selector: 'app-acc-part-admin',
  standalone: false,
  templateUrl: './acc-part-admin.html',
  styleUrl: './acc-part-admin.css',
})
export class AccPartAdmin implements OnInit {

  selectedDesignationId?: number;
  designations: DesignationPart[] = [];
  designationsWithUrl: { item: DesignationPart, fullUrl?: string }[] = [];
  selectedPartUrl?: string;
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  currentPage = 0;
  totalPages = 0;
  categoryAccId?: number;

  selectedPart?: AccPart;
  quantityToAdd = 1;
  partsWithUrl: { parts: AccPart, fullLogoUrl?: string }[] = [];

  designationForm: FormGroup;
  editingDesignationId?: number;
  form: FormGroup;
  editingPartId?: number;
  selectedFile?: File;
  modalRef?: NgbModalRef;

  constructor(
    public authService: AuthService,
    private partService: AccPartsService,
    private publicCarService: PublicCarService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private cartService: CartService,
    private designationPartService: DesignationPartService
  ) {
    this.form = this.fb.group({
      name: [''],
      price: [0],
      costPrice: [0],
      inStock: [true],
      categoryAccId: [null],
      designationId: [null],
      reference: [''],
      description: [''],
      onSale: [false],
      salePercentage: [0],
    });

    this.designationForm = this.fb.group({
      namePart: [''],
    });

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery = query;
      this.currentPage = 0;
      this.loadParts();
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const accessoiresId = params.get('accessoiresId');

      this.currentPage = 0;
      this.categoryAccId = accessoiresId ? Number(accessoiresId) : undefined;

      this.loadParts();
    });

    this.loadDesignations();
  }

  loadDesignations() {
    this.designationPartService.findAll().subscribe(data => {
      const filteredData = this.authService.isAdmin()
        ? data
        : data.filter(d => d.partCount > 0);

      this.designations = filteredData;
      this.designationsWithUrl = filteredData.map(d => ({
        item: d,
        fullUrl: d.logo ? this.publicCarService.getImageUrl(d.logo) : undefined
      }));
    });
  }


  onSearchInput(query: string) {
    this.searchSubject.next(query);
  }

  onSearch() {
    this.currentPage = 0;
    this.loadParts();
  }

  loadParts(page: number = this.currentPage) {
    this.currentPage = page;
    let obs$;
    const desId = this.selectedDesignationId;

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      obs$ = this.partService.searchParts(this.searchQuery, page);
    } else {
      if (this.categoryAccId) {
        obs$ = this.partService.getPartsByCategoryAcc(this.categoryAccId, page, desId || undefined);
      } else {
        obs$ = this.partService.getAllParts(page, desId || undefined);
      }
    }

    obs$.subscribe(data => {
      this.totalPages = data.totalPages;
      this.partsWithUrl = data.content.map(p => ({
        parts: p,
        fullLogoUrl: p.image ? this.publicCarService.getImageUrl(p.image) : undefined
      }));
    });
  }

  toggleCategoryFilter(id: number) {
    // plus de filtre par Category classique pour les accessoires
  }

  toggleSubCategoryFilter(id: number) {
    // pas de sous-catégories pour les accessoires
  }

  toggleDesignationFilter(id: number) {
    this.selectedDesignationId = this.selectedDesignationId === id ? undefined : id;
    this.currentPage = 0;
    this.loadParts();
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  openModal(content: TemplateRef<any>, part?: AccPart) {
    this.editingPartId = part?.id;
    this.form.reset({
      name: part?.name || '',
      price: part?.price || 0,
      costPrice: part?.costPrice || 0,
      inStock: part?.inStock ?? true,
      categoryAccId: this.categoryAccId || part?.categoryAccId || null,
      designationId: part?.designationId || null,
      reference: part?.reference || '',
      description: part?.description || '',
      onSale: part?.onSale ?? false,
      salePercentage: part?.salePercentage || 0
    });

    if (this.modalRef) this.modalRef.close();
    this.modalRef = this.modalService.open(content, {
      centered: true, size: 'lg', backdrop: 'static', keyboard: false
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length) {
      this.selectedFile = event.target.files[0];
    }
  }

  submit() {
    const part: AccPart = this.form.value;

    const request = this.editingPartId
      ? this.partService.updatePart({ ...part, id: this.editingPartId }, this.selectedFile)
      : this.partService.createPart(part, this.selectedFile);

    request.subscribe(() => {
      this.loadParts(this.currentPage);
      this.modalRef?.close();
    });
  }

  deletePart(id: number) {
    if (!confirm('Are you sure?')) return;
    this.partService.deletePart(id).subscribe(() => this.loadParts());
  }

  openUserModal(content: TemplateRef<any>, part: AccPart) {
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

  addToCart(part: AccPart, quantity: number) {
    if (this.selectedPart) {
      this.cartService.addItem(this.selectedPart, quantity);
    }
  }

  onGenerationToggle(genId: number) {
    // pas de compatibilité par génération pour les accessoires
  }

  // ── DESIGNATION PART METHODS ──────────────────────────────────────

  openDesignationModal(content: TemplateRef<any>, des?: DesignationPart) {
    this.editingDesignationId = des?.id;
    this.selectedFile = undefined;
    this.designationForm.reset({
      namePart: des?.namePart || ''
    });
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  submitDesignation(modal: any) {
    const { namePart } = this.designationForm.value;

    const request = this.editingDesignationId
      ? this.designationPartService.update(this.editingDesignationId, namePart, this.selectedFile)
      : this.designationPartService.create(namePart, this.selectedFile);

    request.subscribe({
      next: () => {
        this.loadDesignations();
        modal.close();
        this.selectedFile = undefined;
      },
      error: (err) => console.error("Could not save designation", err)
    });
  }

  deleteDesignation(id: number) {
    if (confirm('Are you sure? This might affect parts linked to this brand.')) {
      this.designationPartService.delete(id).subscribe(() => this.loadDesignations());
    }
  }
}