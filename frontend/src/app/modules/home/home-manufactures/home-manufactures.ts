import { Component, OnInit } from '@angular/core';
import { PublicCarService } from '../../../services/public-car-service';
import { Designation } from '../../../models/Designation';
import { DesignationService } from '../../../services/designation-service';

@Component({
  selector: 'app-home-manufactures',
  standalone: false,
  templateUrl: './home-manufactures.html',
  styleUrl: './home-manufactures.css',
})
export class HomeManufactures implements OnInit {

  designations: Designation[] = [];
  designationsWithUrl: { item: Designation, fullUrl?: string }[] = [];

  constructor(
    private publicCarService: PublicCarService,
    private designationService: DesignationService
  ) {}

  ngOnInit() {
    this.loadDesignations();
  }

  loadDesignations() {
    this.designationService.findAll().subscribe(data => {
      this.designations = data;
      this.designationsWithUrl = data.map(d => ({
        item: d,
        fullUrl: d.logo ? this.publicCarService.getImageUrl(d.logo) : undefined
      }));
    });
  }

  /**
   * Retourne tous les logos pour le scroll automatique
   */
  getAllLogos(): { item: Designation, fullUrl?: string }[] {
    return this.designationsWithUrl;
  }

  /**
   * Retourne la première moitié des logos pour la première rangée
   */
  getFirstHalfLogos(): { item: Designation, fullUrl?: string }[] {
    const midPoint = Math.ceil(this.designationsWithUrl.length / 2);
    return this.designationsWithUrl.slice(0, midPoint);
  }

  /**
   * Retourne la deuxième moitié des logos pour la deuxième rangée
   */
  getSecondHalfLogos(): { item: Designation, fullUrl?: string }[] {
    const midPoint = Math.ceil(this.designationsWithUrl.length / 2);
    return this.designationsWithUrl.slice(midPoint);
  }
}
