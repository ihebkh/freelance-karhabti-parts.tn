import {Component, OnInit, TemplateRef} from '@angular/core';
import {CarBrand} from '../../../models/CarBrand';
import {AdminCarService} from '../../../services/admin-car-service';
import {Router} from '@angular/router';
import {PublicCarService} from '../../../services/public-car-service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../services/auth-service';

@Component({
  selector: 'app-brand-list',
  standalone: false,
  templateUrl: './brand-list.html',
  styleUrl: './brand-list.css',
})
export class BrandList implements OnInit {
  brandsWithUrl: { brand: CarBrand, fullLogoUrl?: string }[] = [];
  form: FormGroup;
  editingBrandId?: number;
  logoFile?: File;
  modalRef?: NgbModalRef;

  constructor(
    public authService: AuthService,

    private adminService: AdminCarService,
    private publicService: PublicCarService,
    private modalService: NgbModal,
    private router:Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({ name: [''] });
  }

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.publicService.getBrands().subscribe(data => {
      this.brandsWithUrl = data.map(b => ({
        brand: b,
        fullLogoUrl: b.logo ? this.publicService.getImageUrl(b.logo) : undefined
      }));
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length) this.logoFile = event.target.files[0];
  }

  submit() {
    const name = this.form.value.name;
    if (this.editingBrandId) {
      this.adminService.updateBrand(this.editingBrandId, name, this.logoFile)
        .subscribe(() => {
          this.loadBrands();
          this.modalRef?.close(); // Close the modal
        });
    } else {
      this.adminService.createBrand(name, this.logoFile)
        .subscribe(() => {
          this.loadBrands();
          this.modalRef?.close(); // Close the modal
        });
    }
  }

// Also add error handling and modal dismissal
  openModal(content: TemplateRef<any>, brand?: CarBrand) {
    this.editingBrandId = brand?.id;
    this.form.reset({ name: brand?.name || '' });
    this.logoFile = undefined;

    // Close any existing modal first
    if (this.modalRef) {
      this.modalRef.close();
    }

    this.modalRef = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }
  deleteBrand(id: number) {
    if (!confirm('Are you sure?')) return;
    this.adminService.deleteBrand(id).subscribe(() => this.loadBrands());
  }

  viewModels(brandId: number) {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/cars/brands', brandId, 'models']);
    }
    else {
      this.router.navigate(['/cars/brands', brandId, 'models']);

    }
  }

}
