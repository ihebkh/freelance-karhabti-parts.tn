import { Component, OnInit, OnDestroy } from '@angular/core';

interface Notification {
  client: string;
  location: string;
  product: string;
  price: string;
}

@Component({
  selector: 'app-alert-home',
  standalone: false,
  templateUrl: './alert-home.html',
  styleUrl: './alert-home.css',
})
export class AlertHome implements OnInit, OnDestroy {

  // 10 notifications prédéfinies
  private notifications: Notification[] = [
    {
      client: "Rassas Moncef",
      location: "Monastir",
      product: "IGNITION COIL LAGUNA 1 MEGANE 1",
      price: "33,926 TND"
    },
    {
      client: "Ahmed Ben Ali",
      location: "Tunis",
      product: "OIL FILTER PEUGEOT 206",
      price: "12,500 TND"
    },
    {
      client: "Salma Trabelsi",
      location: "Sousse",
      product: "BRAKE PADS RENAULT CLIO",
      price: "45,800 TND"
    },
    {
      client: "Mohamed Gharbi",
      location: "Sfax",
      product: "REAR SHOCK ABSORBER GOLF 4",
      price: "78,200 TND"
    },
    {
      client: "Leila Khediri",
      location: "Nabeul",
      product: "CLUTCH KIT MERCEDES C-CLASS",
      price: "156,900 TND"
    },
    {
      client: "Karim Jendoubi",
      location: "Bizerte",
      product: "ENGINE RADIATOR PASSAT B6",
      price: "92,400 TND"
    },
    {
      client: "Nadia Sassi",
      location: "Ariana",
      product: "TIMING BELT AUDI A4",
      price: "67,300 TND"
    },
    {
      client: "Youssef Maaloul",
      location: "Mahdia",
      product: "ALTERNATOR BMW 3 SERIES",
      price: "234,500 TND"
    },
    {
      client: "Fatma Bouazizi",
      location: "Gabès",
      product: "EXHAUST MUFFLER FIAT PUNTO",
      price: "189,700 TND"
    },
    {
      client: "Hichem Dridi",
      location: "Kairouan",
      product: "12V 70AH CAR BATTERY",
      price: "145,000 TND"
    }
  ];

  currentNotification: Notification | null = null;
  showNotification = false;
  private intervalId?: any;
  private currentIndex = 0;

  ngOnInit() {
    // Afficher la première notification après 2 secondes
    setTimeout(() => {
      this.showNextNotification();
    }, 2000);

    // Changer la notification toutes les 50 secondes
    this.intervalId = setInterval(() => {
      this.showNextNotification();
    }, 50000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private showNextNotification() {
    // Masquer l'ancienne notification avec animation
    this.showNotification = false;

    // Attendre la fin de l'animation de sortie
    setTimeout(() => {
      // Afficher la notification suivante
      this.currentNotification = this.notifications[this.currentIndex];
      this.showNotification = true;

      // Passer à l'index suivant (boucle infinie)
      this.currentIndex = (this.currentIndex + 1) % this.notifications.length;
    }, 300);
  }

  closeNotification() {
    this.showNotification = false;
  }

  // Méthode pour obtenir la première lettre du prénom
  getFirstLetter(): string {
    if (!this.currentNotification) return '';
    const firstName = this.currentNotification.client.split(' ')[0];
    return firstName.charAt(0).toUpperCase();
  }

  // Méthode pour obtenir une couleur de fond basée sur la lettre
  getAvatarColor(): string {
    if (!this.currentNotification) return '#6366f1';

    const colors = [
      '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
      '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ];

    const firstName = this.currentNotification.client.split(' ')[0];
    const charCode = firstName.charCodeAt(0);
    return colors[charCode % colors.length];
  }
}
