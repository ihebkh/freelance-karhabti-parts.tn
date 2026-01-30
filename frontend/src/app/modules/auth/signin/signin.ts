import { Component } from '@angular/core';
import {UserService} from '../../../services/user-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  email = '';
  password = '';

  message = '';
  error = '';

  constructor(private userService: UserService,     private router: Router   ) {}

  login(form: any) {
    if (form.invalid) return;

    this.message = '';
    this.error = '';

    this.userService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: err => {
        this.error = err.error?.message || 'Login failed';
      }
    });
  }

}
