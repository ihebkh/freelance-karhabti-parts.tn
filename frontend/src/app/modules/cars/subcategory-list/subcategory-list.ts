import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SubCategory } from '../../../models/SubCategory';
import { AdminCategoryService } from '../../../services/admin-category-service';
import { PublicCategoryService } from '../../../services/public-category-service';
import { AuthService } from '../../../services/auth-service';
import {PublicCarService} from '../../../services/public-car-service';
@Component({
  selector: 'app-subcategory-list',
  standalone: false,
  templateUrl: './subcategory-list.html',
  styleUrl: './subcategory-list.css',
})
export class SubcategoryList implements OnInit {
  categoryId!: number;
  subCategories: { sub: SubCategory, fullImageUrl?: string }[] = [];
  form: FormGroup;
  editingSubCategoryId?: number;
  imageFile?: File;
  modalRef?: NgbModalRef;

  constructor(
    private router:Router,
    public authService: AuthService,

    private route: ActivatedRoute,
    private adminCategoryService: AdminCategoryService,
    private publicCategoryService: PublicCategoryService,
    private publicService: PublicCarService,

    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({ name: [''] });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('categoryId');

    if (idParam) {
      this.categoryId = Number(idParam);
      this.loadSubCategories();
    }

    this.loadSubCategories();
  }

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
        .subscribe(() => {
          this.loadSubCategories();
          this.modalRef?.close();
        });
    } else {
      this.adminCategoryService.createSubCategory(this.categoryId, name, this.imageFile)
        .subscribe(() => {
          this.loadSubCategories();
          this.modalRef?.close();
        });
    }
  }

  openModal(content: TemplateRef<any>, subCategory?: SubCategory) {
    this.editingSubCategoryId = subCategory?.id;
    this.form.reset({ name: subCategory?.name || '' });
    this.imageFile = undefined;
    if (this.modalRef) this.modalRef.close();
    this.modalRef = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }
  toSubCategory(categoryId: number){
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/cars/subcategories', categoryId, 'parts']);
    }
    else {
      this.router.navigate(['/cars/subcategories', categoryId, 'parts']);

    }
  }
  deleteSubCategory(id: number) {
    if (!confirm('Are you sure?')) return;
    this.adminCategoryService.deleteSubC(id).subscribe(() => this.loadSubCategories());
  }
}
