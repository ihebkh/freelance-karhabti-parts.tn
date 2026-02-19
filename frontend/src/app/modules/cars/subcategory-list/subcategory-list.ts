import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SubCategory } from '../../../models/SubCategory';
import { CategoryAcc } from '../../../models/CategoryAcc';
import { AdminCategoryService } from '../../../services/admin-category-service';
import { PublicCategoryService } from '../../../services/public-category-service';
import { AuthService } from '../../../services/auth-service';
import { PublicCarService } from '../../../services/public-car-service';

@Component({
  selector: 'app-subcategory-list',
  standalone: false,
  templateUrl: './subcategory-list.html',
  styleUrl: './subcategory-list.css',
})
export class SubcategoryList implements OnInit {
  categoryId!: number;
  subCategories: { sub: SubCategory, fullImageUrl?: string }[] = [];
  categoryAccList: { cat: CategoryAcc, fullImageUrl?: string }[] = [];

  form: FormGroup;
  categoryAccForm: FormGroup;

  editingSubCategoryId?: number;
  editingCategoryAccId?: number;

  imageFile?: File;
  categoryAccImageFile?: File;

  modalRef?: NgbModalRef;
  categoryAccModalRef?: NgbModalRef;

  constructor(
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute,
    private adminCategoryService: AdminCategoryService,
    private publicCategoryService: PublicCategoryService,
    private publicService: PublicCarService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({ name: [''] });
    this.categoryAccForm = this.fb.group({ name: [''] });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('categoryId');
    if (idParam) {
      this.categoryId = Number(idParam);
      this.loadSubCategories();
    }
    this.loadSubCategories();
    this.loadCategoryAcc();
  }

  // SubCategory
  loadSubCategories() {
    this.publicCategoryService.getSubCategoriesByCategory(this.categoryId).subscribe(data => {
      this.subCategories = data.map(s => ({
        sub: s,
        fullImageUrl: s.image ? this.publicService.getImageUrl(s.image) : undefined
      }));
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length) this.imageFile = event.target.files[0];
  }

  submit() {
    const name = this.form.value.name;
    if (this.editingSubCategoryId) {
      this.adminCategoryService.updateSubCategory(this.editingSubCategoryId, name, this.imageFile)
        .subscribe(() => { this.loadSubCategories(); this.modalRef?.close(); });
    } else {
      this.adminCategoryService.createSubCategory(this.categoryId, name, this.imageFile)
        .subscribe(() => { this.loadSubCategories(); this.modalRef?.close(); });
    }
  }

  openModal(content: TemplateRef<any>, subCategory?: SubCategory) {
    this.editingSubCategoryId = subCategory?.id;
    this.form.reset({ name: subCategory?.name || '' });
    this.imageFile = undefined;
    if (this.modalRef) this.modalRef.close();
    this.modalRef = this.modalService.open(content, {
      centered: true, size: 'lg', backdrop: 'static', keyboard: false
    });
  }

  toSubCategory(categoryId: number) {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/cars/subcategories', categoryId, 'parts']);
    } else {
      this.router.navigate(['/cars/subcategories', categoryId, 'parts']);
    }
  }

  deleteSubCategory(id: number) {
    if (!confirm('Are you sure?')) return;
    this.adminCategoryService.deleteSubC(id).subscribe(() => this.loadSubCategories());
  }

  // CategoryAcc
  loadCategoryAcc() {
    this.adminCategoryService.getAllCategoryAcc().subscribe(data => {
      this.categoryAccList = data.map(c => ({
        cat: c,
        fullImageUrl: c.image ? this.publicService.getImageUrl(c.image) : undefined
      }));
    });
  }

  onCategoryAccFileChange(event: any) {
    if (event.target.files.length) this.categoryAccImageFile = event.target.files[0];
  }

  submitCategoryAcc() {
    const name = this.categoryAccForm.value.name;
    if (this.editingCategoryAccId) {
      this.adminCategoryService.updateCategoryAcc(this.editingCategoryAccId, name, this.categoryAccImageFile)
        .subscribe(() => { this.loadCategoryAcc(); this.categoryAccModalRef?.close(); });
    } else {
      this.adminCategoryService.createCategoryAcc(name, this.categoryAccImageFile)
        .subscribe(() => { this.loadCategoryAcc(); this.categoryAccModalRef?.close(); });
    }
  }

  openCategoryAccModal(content: TemplateRef<any>, categoryAcc?: CategoryAcc) {
    this.editingCategoryAccId = categoryAcc?.id;
    this.categoryAccForm.reset({ name: categoryAcc?.name || '' });
    this.categoryAccImageFile = undefined;
    if (this.categoryAccModalRef) this.categoryAccModalRef.close();
    this.categoryAccModalRef = this.modalService.open(content, {
      centered: true, size: 'lg', backdrop: 'static', keyboard: false
    });
  }

  toCategoryAcc(categoryAccId: number) {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/accessories/categoryacc', categoryAccId, 'parts']);
    } else {
      this.router.navigate(['/accessories/categoryacc', categoryAccId, 'parts']);
    }
  }

  deleteCategoryAcc(id: number) {
    if (!confirm('Are you sure?')) return;
    this.adminCategoryService.deleteCategoryAcc(id).subscribe(() => this.loadCategoryAcc());
  }
}