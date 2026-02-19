import { Component, OnInit, TemplateRef } from '@angular/core';
import { Category } from '../../../models/Category';
import { SubCategory } from '../../../models/SubCategory';
import { DesignationPart } from '../../../models/DesignationPart';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
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
import { DesignationPartService } from '../../../services/designationpart-service';

@Component({
  selector: 'app-acc-part-admin',
  standalone: false,
  templateUrl: './acc-part-admin.html',
  styleUrl: './acc-part-admin.css',
})
export class AccPartAdmin implements OnInit {

  selectedCategoryId?: number;
  selectedSubCategoryId?: number;
  categoriesForFilter: Category[] = [];
  subCategoriesForFilter: SubCategory[] = [];
  categoriesForFilterWithUrl: { item: Category, fullUrl?: string }[] = [];
  subCategoriesForFilterWithUrl: { item: SubCategory, fullUrl?: string }[] = [];

  selectedDesignationId?: number;
  designations: DesignationPart[] = [];
  designationsWithUrl: { item: DesignationPart, fullUrl?: string }[] = [];
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

  designationForm: FormGroup;
  editingDesignationId?: number;
  form: FormGroup;
  editingPartId?: number;
  selectedFile?: File;
  modalRef?: NgbModalRef;

  generationId?: number;
  subcategoryId?: number;

  constructor(
    private publicCategoryService: PublicCategoryService,
    public authService: AuthService,
    private partService: CarPartsService,
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
      generationIds: [[]],
      categoryId: [null],
      subCategoryId: [null],
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
      const generationId = params.get('generationId');
      const subcategoryId = params.get('subcategoryId');

      this.currentPage = 0;
      this.isSubcategoryContext = !!subcategoryId;
      this.isGenerationContext = !!generationId && !subcategoryId;
      this.isGlobalContext = !subcategoryId && !generationId;

      this.subcategoryId = subcategoryId ? Number(subcategoryId) : undefined;
      this.generationId = generationId ? Number(generationId) : undefined;

      this.loadParts();
    });

    this.loadCategoriesForFilter();
    this.loadGenerations();
    this.loadCategories();
    this.loadDesignations();
  }

  loadCategories() {
    this.publicCategoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
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

  loadCategoriesForFilter() {
    this.publicCategoryService.getCategories().subscribe(data => {
      this.categoriesForFilter = data;
      this.categoriesForFilterWithUrl = data.map(c => ({
        item: c,
        fullUrl: c.image ? this.publicCarService.getImageUrl(c.image) : undefined
      }));
    });
  }

  loadSubCategories(catId: number) {
    if (this.selectedCategoryId === undefined) {
      this.subCategoriesForFilter = [];
      this.subCategoriesForFilterWithUrl = [];
      return;
    }

    this.publicCategoryService.getSubCategoriesByCategory(catId).subscribe(data => {
      this.subCategoriesForFilter = data;
      this.subCategoriesForFilterWithUrl = data.map(sc => ({
        item: sc,
        fullUrl: sc.image ? this.publicCarService.getImageUrl(sc.image) : undefined
      }));
    });
  }

  loadGenerations() {
    this.publicCarService.getAllGenerations().subscribe(data => {
      this.generations = data;
    });
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    if (!selectElement) return;

    const categoryId = Number(selectElement.value);
    if (!categoryId) {
      this.subCategories = [];
      this.form.patchValue({ categoryId: null, subCategoryId: null });
      return;
    }

    this.form.patchValue({ categoryId: categoryId });
    this.publicCategoryService.getSubCategoriesByCategory(categoryId).subscribe(subs => {
      this.subCategories = subs;
      this.form.patchValue({ subCategoryId: null });
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
    const catId = this.selectedCategoryId;
    const subCatId = this.selectedSubCategoryId;

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      obs$ = this.partService.searchParts(this.searchQuery, page);
    } else {
      obs$ = this.generationId
        ? this.partService.getPartsByGeneration(this.generationId, page, desId, catId, subCatId)
        : this.subcategoryId
          ? this.partService.getPartsBySubCategory(this.subcategoryId, page, desId)
          : this.partService.getAllParts(page, desId, catId, subCatId);
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
    if (this.selectedCategoryId === id) {
      this.selectedCategoryId = undefined;
      this.selectedSubCategoryId = undefined;
    } else {
      this.selectedCategoryId = id;
      this.selectedSubCategoryId = undefined;
    }
    this.currentPage = 0;
    this.loadSubCategories(id);
    this.loadParts();
  }

  toggleSubCategoryFilter(id: number) {
    this.selectedSubCategoryId = this.selectedSubCategoryId === id ? undefined : id;
    this.currentPage = 0;
    this.loadParts();
  }

  toggleDesignationFilter(id: number) {
    this.selectedDesignationId = this.selectedDesignationId === id ? undefined : id;
    this.currentPage = 0;
    this.loadParts();
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  openModal(content: TemplateRef<any>, part?: CarPart) {
    this.editingPartId = part?.id;
    let initialGenIds = part?.compatibility?.map(c => c.id) ||
      (this.isGenerationContext && this.generationId ? [this.generationId] : []);

    this.form.reset({
      name: part?.name || '',
      price: part?.price || 0,
      costPrice: part?.costPrice || 0,
      inStock: part?.inStock ?? true,
      generationIds: initialGenIds,
      categoryId: part?.categoryId || null,
      subCategoryId: part?.subCategoryId || this.subcategoryId || null,
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
    const part: CarPart = this.form.value;

    if (!part.subCategoryId) {
      alert('Veuillez sélectionner une sous-catégorie');
      return;
    }

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
    if (this.selectedPart) {
      this.cartService.addItem(this.selectedPart, quantity);
    }
  }

  onGenerationToggle(genId: number) {
    const currentIds: number[] = this.form.get('generationIds')?.value || [];
    const index = currentIds.indexOf(genId);
    if (index > -1) {
      currentIds.splice(index, 1);
    } else {
      currentIds.push(genId);
    }
    this.form.get('generationIds')?.setValue([...currentIds]);
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