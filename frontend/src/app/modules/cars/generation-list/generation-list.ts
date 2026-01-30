import {Component, OnInit, TemplateRef} from '@angular/core';
import {CarGeneration} from '../../../models/CarGeneration';
import {AdminCarService} from '../../../services/admin-car-service';
import {ActivatedRoute, Router} from '@angular/router';
import {PublicCarService} from '../../../services/public-car-service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CarModel} from '../../../models/CarModel';
import {AuthService} from '../../../services/auth-service';

@Component({
  selector: 'app-generation-list',
  standalone: false,
  templateUrl: './generation-list.html',
  styleUrl: './generation-list.css',
})
export class GenerationList implements OnInit {

  generationsWithUrl: { generation: CarGeneration, fullLogoUrl?: string }[] = [];

  modelId!: number;

  form: FormGroup;
  editingGenerationId?: number;
  imageFile?: File;
  modalRef?: NgbModalRef;

  constructor(
    public authService: AuthService,

    private adminService: AdminCarService,
    private publicService: PublicCarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router:Router,
  ) {
    this.form = this.fb.group({
      name: ['']
    });
  }

  ngOnInit() {
    this.modelId = +this.route.snapshot.params['modelId'];
    this.loadGenerations();
  }

  loadGenerations() {
    this.publicService
      .getGenerationsByModel(this.modelId)
      .subscribe(data =>


        {
          this.generationsWithUrl = data.map(g => ({
            generation: g,
            fullLogoUrl: g.image ? this.publicService.getImageUrl(g.image) : undefined
          }));
        }
        // this.generations = data

      );
  }

  openModal(content: TemplateRef<any>, generation?: CarGeneration) {
    this.editingGenerationId = generation?.id;
    this.form.reset({ name: generation?.name || '' });
    this.imageFile = undefined;

    if (this.modalRef) this.modalRef.close();

    this.modalRef = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length) {
      this.imageFile = event.target.files[0];
    }
  }

  submit() {
    const name = this.form.value.name;

    if (this.editingGenerationId) {
      this.adminService
        .updateGeneration(this.editingGenerationId, name, this.imageFile)
        .subscribe(() => {
          this.loadGenerations();
          this.modalRef?.close();
        });
    } else {
      this.adminService
        .createGeneration(this.modelId, name, this.imageFile)
        .subscribe(() => {
          this.loadGenerations();
          this.modalRef?.close();
        });
    }
  }

  deleteGeneration(id: number) {
    if (!confirm('Are you sure?')) return;
    this.adminService.deleteGeneration(id).subscribe(() => this.loadGenerations());
  }


  viewParts(generationId: number) {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/cars/generations',generationId, 'parts']);
    }
    else {
      this.router.navigate(['/cars/generations', generationId, 'parts']);

    }
  }
}
