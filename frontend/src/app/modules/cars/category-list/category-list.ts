import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Category } from '../../../models/Category';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AdminCategoryService } from '../../../services/admin-category-service';
import { PublicCategoryService } from '../../../services/public-category-service';
import { PublicCarService } from '../../../services/public-car-service';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  categories: { category: Category, fullImageUrl?: string }[] = [];
  form: FormGroup;
  editingCategoryId?: number;
  imageFile?: File;
  modalRef?: NgbModalRef;

  constructor(
    public authService: AuthService,
    private adminService: AdminCategoryService,
    private publicCategoryService: PublicCategoryService,
    private publicService: PublicCarService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({ name: [''] });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.publicCategoryService.getCategories().subscribe(data => {
      this.categories = data.map(c => ({
        category: c,
        fullImageUrl: c.image ? this.publicService.getImageUrl(c.image) : undefined
      }));
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length) this.imageFile = event.target.files[0];
  }

  submit() {
    const name = this.form.value.name;
    if (this.editingCategoryId) {
      this.adminService.updateCategory(this.editingCategoryId, name, this.imageFile)
        .subscribe(() => {
          this.loadCategories();
          this.modalRef?.close();
        });
    } else {
      this.adminService.createCategory(name, this.imageFile)
        .subscribe(() => {
          this.loadCategories();
          this.modalRef?.close();
        });
    }
  }

  openModal(content: TemplateRef<any>, category?: Category) {
    this.editingCategoryId = category?.id;
    this.form.reset({ name: category?.name || '' });
    this.imageFile = undefined;
    if (this.modalRef) this.modalRef.close();
    this.modalRef = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  deleteCategory(id: number) {
    if (!confirm('Are you sure?')) return;
    this.adminService.deleteC(id).subscribe(() => this.loadCategories());
  }

  toSubCategory(categoryId: number) {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/cars/categories', categoryId, 'subcategories']);
    }
    else {
      this.router.navigate(['/cars/categories', categoryId, 'subcategories']);

    }
  }
}
