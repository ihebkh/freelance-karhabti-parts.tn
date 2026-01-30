import {Component} from '@angular/core';
import {AuthService} from '../../services/auth-service';
import {UserService} from '../../services/user-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isMenuOpen = false;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.closeMenu();
    this.userService.logout();
    this.router.navigate(['/auth/signin']);
  }
}
