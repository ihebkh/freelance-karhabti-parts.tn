import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../../services/user-service';

@Component({
  selector: 'app-verify',
  standalone: false,
  templateUrl: './verify.html',
  styleUrl: './verify.css',
})
export class Verify implements OnInit {
  loading = true;

  success = '';
  error = '';

  showResend = false;
  email = '';

  resendMessage = '';
  resendLoading = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.loading = false;
      this.error = 'Invalid verification link';
      this.showResend = true;
      return;
    }

    this.userService.verify(token).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Your account has been verified successfully!';
      },
      error: () => {
        this.loading = false;
        this.error = 'Verification failed or token expired.';
        this.showResend = true;
      }
    });
  }

  resend() {
    if (!this.email) return;

    this.resendLoading = true;
    this.resendMessage = '';
    this.error = '';

    this.userService.resendVerification(this.email).subscribe({
      next: () => {
        this.resendLoading = false;
        this.resendMessage =
          'A new verification email has been sent. Please check your inbox.';
        this.showResend = false;
      },
      error: () => {
        this.resendLoading = false;
        this.error = 'Failed to resend verification email.';
      }
    });
  }
}
