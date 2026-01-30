import { Component } from '@angular/core';
import {UserService} from '../../../services/user-service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  phone='';
  whatsapp='';


  errorMessage = '';
  successMessage = '';

  constructor(private userService: UserService) {}

  onSubmit(form: any) {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid || this.password !== this.confirmPassword) {
      return;
    }

    const user = {
      username: this.username.trim(),
      email: this.email.toLowerCase(),
      password: this.password,
      phone: this.phone,
      whatsapp: this.whatsapp
    };

    this.userService.register(user).subscribe({
      next: () => {
        this.successMessage =
          'Compte créé avec succès. Vérifiez votre e-mail.';
        form.resetForm();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Échec de l’inscription';
      },
    });
  }
}
