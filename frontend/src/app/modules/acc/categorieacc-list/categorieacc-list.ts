import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategoryAcc } from '../../../models/CategoryAcc';
import { AdminCategoryService } from '../../../services/admin-category-service';
import { AuthService } from '../../../services/auth-service';
import { PublicCarService } from '../../../services/public-car-service';
import { CategorieAccService } from '../../../services/categorie-acc';

@Component({
  selector: 'app-categorieacc-list',
  standalone: false,
  templateUrl: './categorieacc-list.html',
  styleUrl: './categorieacc-list.css',
})
export class CategorieaccList implements OnInit {

  categoryAccList: { cat: CategoryAcc, fullImageUrl?: string }[] = [];
  form: FormGroup;
  editingCategoryAccId?: number;
  imageFile?: File;
  modalRef?: NgbModalRef;

  constructor(
    private router: Router,
    public authService: AuthService,
    private adminCategoryService: AdminCategoryService,
    private categorieAccService: CategorieAccService,
    private publicService: PublicCarService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({ name: [''] });
  }

  ngOnInit() {
    this.loadCategoryAcc();
  }

  loadCategoryAcc() {
    this.categorieAccService.getAll().subscribe(data => {
      this.categoryAccList = data.map(c => ({
        cat: c,
        fullImageUrl: c.image ? this.publicService.getImageUrl(c.image) : undefined
      }));
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length) this.imageFile = event.target.files[0];
  }

  submit() {
    const name = this.form.value.name;
    if (this.editingCategoryAccId) {
      this.adminCategoryService.updateCategoryAcc(this.editingCategoryAccId, name, this.imageFile)
        .subscribe(() => {
          this.loadCategoryAcc();
          this.modalRef?.close();
        });
    } else {
      this.adminCategoryService.createCategoryAcc(name, this.imageFile)
        .subscribe(() => {
          this.loadCategoryAcc();
          this.modalRef?.close();
        });
    }
  }

  openModal(content: TemplateRef<any>, categoryAcc?: CategoryAcc) {
    this.editingCategoryAccId = categoryAcc?.id;
    this.form.reset({ name: categoryAcc?.name || '' });
    this.imageFile = undefined;
    if (this.modalRef) this.modalRef.close();
    this.modalRef = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  toCategoryAcc(categoryAccId: number) {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/acc/accessoires', categoryAccId, 'categoriesacc']);
    } else {
      this.router.navigate(['/acc/accessoires', categoryAccId, 'categoriesacc']);
    }
  }

  deleteCategoryAcc(id: number) {
    if (!confirm('Are you sure?')) return;
    this.adminCategoryService.deleteCategoryAcc(id).subscribe(() => this.loadCategoryAcc());
  }
}