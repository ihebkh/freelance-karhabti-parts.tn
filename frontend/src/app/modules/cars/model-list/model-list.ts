import {Component, OnInit, TemplateRef} from '@angular/core';
import {CarModel} from '../../../models/CarModel';
import {AdminCarService} from '../../../services/admin-car-service';
import {ActivatedRoute, Router} from '@angular/router';
import {PublicCarService} from '../../../services/public-car-service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CarBrand} from '../../../models/CarBrand';
import {AuthService} from '../../../services/auth-service';

@Component({
  selector: 'app-model-list',
  standalone: false,
  templateUrl: './model-list.html',
  styleUrl: './model-list.css',
})
export class ModelList implements OnInit {
  modelsWithUrl: { model: CarModel, fullLogoUrl?: string }[] = [];

  brandId!: number;

  // Form & modal
  form: FormGroup;
  editingModelId?: number;
  imageFile?: File;
  modalRef?: NgbModalRef;

  constructor(
    public authService: AuthService,
    private adminService: AdminCarService,
    private publicService: PublicCarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.form = this.fb.group({ name: [''] });
  }

  ngOnInit() {
    this.brandId = +this.route.snapshot.params['brandId'];
    this.loadModels();
  }

  loadModels() {
    this.publicService.getModelsByBrand(this.brandId).subscribe(data =>

      {
        this.modelsWithUrl = data.map(m => ({
          model: m,
          fullLogoUrl: m.image ? this.publicService.getImageUrl(m.image) : undefined
        }));
      }
      // this.models = data
    );
  }

  // Modal
  openModal(content: TemplateRef<any>, model?: CarModel) {
    this.editingModelId = model?.id;
    this.form.reset({ name: model?.name || '' });
    this.imageFile = undefined;

    // Close any existing modal first
    if (this.modalRef) this.modalRef.close();

    this.modalRef = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length) this.imageFile = event.target.files[0];
  }

  submit() {
    const name = this.form.value.name;

    if (this.editingModelId) {
      this.adminService.updateModel(this.editingModelId, name, this.imageFile)
        .subscribe(() => {
          this.loadModels();
          this.modalRef?.close();
        });
    } else {
      this.adminService.createModel(this.brandId, name, this.imageFile)
        .subscribe(() => {
          this.loadModels();
          this.modalRef?.close();
        });
    }
  }

  deleteModel(id: number) {
    if (!confirm('Are you sure?')) return;
    this.adminService.deleteModel(id).subscribe(() => this.loadModels());
  }

  viewGenerations(modelId: number) {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/cars/models', modelId, 'generations']);
    }
    else {
      this.router.navigate(['/cars/models', modelId, 'generations']);

    }
  }
}
