import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../services/user-service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnInit {
  email = '';
  newPassword = '';
  confirmPassword = '';
  token: string | null = null;

  message = '';
  error = '';
  isLoading = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user arrived here via an email link (URL?token=...)
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  requestReset(form: any) {
    if (form.invalid) return;

    this.message = '';
    this.error = '';
    this.isLoading = true;

    this.userService.requestPasswordReset(this.email).subscribe({
      next: (res) => {
        this.message = res.message;
        this.isLoading = false;
        form.resetForm();
      },
      error: (err) => {
        this.error = err.error?.message || 'Échec de l’envoi du lien';
        this.isLoading = false;
      }
    });
  }

  resetPassword(form: any) {
    if (form.invalid || this.newPassword !== this.confirmPassword) {
      return;
    }

    this.message = '';
    this.error = '';
    this.isLoading = true;

    this.userService
      .completePasswordReset(this.token!, this.newPassword)
      .subscribe({
        next: () => {
          this.router.navigate(['/auth/signin'], {
            queryParams: { reset: 'success' }
          });
        },
        error: (err) => {
          this.error = err.error?.message || 'Échec de la mise à jour';
          this.isLoading = false;
        }
      });
  }
}
