// vin.ts - Version avec service d'authentification

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
// import { AuthService } from '@services/auth.service'; // Décommentez et ajustez le chemin

@Component({
  selector: 'app-vin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vin.html',
  styleUrls: ['./vin.css']
})
export class Vin implements OnInit, OnDestroy {
  // Propriétés pour la recherche VIN
  vinNumber: string = '';
  isSearching: boolean = false;
  errorMessage: string = '';
  
  // Propriété pour l'état de connexion
  isLoggedIn: boolean = false;
  
  // Subscription pour nettoyer
  private authSubscription?: Subscription;

  constructor(
    // private authService: AuthService // Décommentez si vous avez un service d'auth
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    
    // Si vous avez un service d'authentification avec Observable :
    // this.authSubscription = this.authService.isLoggedIn$.subscribe(
    //   (status) => {
    //     this.isLoggedIn = status;
    //   }
    // );
  }

  ngOnDestroy(): void {
    // Nettoyer les subscriptions
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Méthode pour vérifier l'état de connexion
  checkLoginStatus(): void {
    // OPTION 1: Vérification via localStorage
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    this.isLoggedIn = !!(token && user);
    
    // OPTION 2: Vérification via sessionStorage
    // const sessionToken = sessionStorage.getItem('authToken');
    // this.isLoggedIn = !!sessionToken;
    
    // OPTION 3: Vérification via service d'authentification
    // this.isLoggedIn = this.authService.isAuthenticated();
  }

  // Méthode pour gérer les changements dans le champ VIN
  onVinInput(): void {
    this.clearError();
  }

  // Méthode pour effacer l'erreur
  clearError(): void {
    this.errorMessage = '';
  }

  // Méthode de recherche par VIN
  searchByVin(): void {
    if (!this.vinNumber || this.vinNumber.trim().length === 0) {
      this.errorMessage = 'Veuillez entrer un numéro VIN valide';
      return;
    }

    // Vérifier si l'utilisateur est connecté
    if (!this.isLoggedIn) {
      this.errorMessage = 'Veuillez vous connecter pour effectuer une recherche';
      // Optionnel: rediriger vers la page de connexion
      // this.router.navigate(['/login']);
      return;
    }

    this.isSearching = true;
    this.errorMessage = '';

    console.log('Recherche VIN:', this.vinNumber);
    
    // Votre logique de recherche ici
    setTimeout(() => {
      this.isSearching = false;
      // Simuler un succès
      console.log('Recherche terminée');
    }, 2000);
  }

  // Méthode pour se connecter (optionnel)
  goToLogin(): void {
    // this.router.navigate(['/login']);
    console.log('Redirection vers la page de connexion');
  }
}