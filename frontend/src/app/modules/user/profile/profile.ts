import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user-service';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  profileForm!: FormGroup;

  user: any = {};
  profilePictureFile!: File;
  profilePictureUrl: any;
  isUploading = false;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.profileForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern('^[^\\s]+$'),
        Validators.minLength(3)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern('^(2|3|4|5|7|9)\\d{7}$')
      ]],
      whatsapp: ['', [
        Validators.required,
        Validators.pattern('^(2|3|4|5|7|9)\\d{7}$')
      ]]
    });

    this.loadProfile();
  }
  loadProfile() {
    this.userService.getCurrentUser().subscribe((res: any) => {
      this.user = res;

      this.profileForm.patchValue({
        username: res.username,
        phone: res.phone,
        whatsapp: res.whatsapp
      });

      if (res.profilePicture) {
        this.userService.getProfilePicture(res.id).subscribe(blob => {
          this.profilePictureUrl = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(blob)
          );
        });
      }
    });
  }

  uploadProfilePicture() {
    if (!this.profilePictureFile) return;

    this.isUploading = true;

    this.userService
      .updateProfilePicture(this.user.id, this.profilePictureFile)
      .subscribe({
        next: () => {
          this.isUploading = false;
          this.loadProfile();
        },
        error: () => {
          this.isUploading = false;
          alert('Upload failed');
        }
      });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      // this.profileForm.value contains the validated username, phone, and whatsapp
      this.userService.updateProfileInfo(this.user.id, this.profileForm.value)
        .subscribe({
          next: () => {
            alert('Profile updated successfully!');
            this.profileForm.markAsPristine();
            this.loadProfile();
          },
          error: (err) => {
            console.error('Update failed', err);
            alert('Could not update profile. Please try again.');
          }
        });
    }
  }
  onProfilePictureSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    this.profilePictureFile = file;
    this.profilePictureUrl =
      this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(file)
      );
  }



  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}
