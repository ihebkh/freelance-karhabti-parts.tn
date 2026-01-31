import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PublicCarService } from '../../../services/public-car-service';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-vin',
  standalone: false,
  templateUrl: './vin.html',
  styleUrl: './vin.css',
})
export class Vin {
  vinNumber: string = '';
  isSearching: boolean = false;

  constructor(
    private publicCarService: PublicCarService,
    private authService: AuthService,
    private router: Router
  ) {}

  searchByVin() {
    const query = this.vinNumber.trim().toUpperCase();
    
    if (!query) {
      alert('Veuillez entrer un numéro d\'immatriculation');
      return;
    }

    this.isSearching = true;
    
    this.publicCarService.lookupVin(query).subscribe({
      next: (res: any) => {
        this.isSearching = false;

        const isAdmin = this.authService.isAdmin();
        const base = isAdmin ? '/admin/cars' : '/cars';

        const targetUrl = res.type === 'brand'
          ? `${base}/brands/${res.id}/models`
          : `${base}/models/${res.id}/generations`;

        this.router.navigate([targetUrl]);
        this.vinNumber = '';
      },
      error: (err) => {
        this.isSearching = false;
        const errorMsg = err.error?.message || "VIN non trouvé ou marque non supportée.";
        alert(errorMsg);
      }
    });
  }

  onEnterPress() {
    this.searchByVin();
  }
}