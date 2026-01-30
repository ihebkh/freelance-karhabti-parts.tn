import {Component, OnInit} from '@angular/core';
import {User} from '../../../models/UserModel';
import {UserService} from '../../../services/user-service';
import {PublicCarService} from '../../../services/public-car-service';

@Component({
  selector: 'app-users-list',
  standalone: false,
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList implements OnInit {
  users: User[] = [];
  filterOptions = ['ALL', 'USER', 'ADMIN','SUPER_ADMIN'];
  selectedRole = 'ALL';
  currentUser: User | null = null;
  currentPage = 0;
  totalPages = 0;

  pendingUpdate: { userId: number, newRole: string } | null = null;

  // Inject PublicCarsService
  constructor(
    private userService: UserService,
    private publicService: PublicCarService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
    this.loadUsers();
  }

  canEditRole(targetUser: User): boolean {
    if (!this.currentUser) return false;

    const isSuperAdmin = this.currentUser.role === 'SUPER_ADMIN';

    const isNotSelf = this.currentUser.id !== targetUser.id;

    return isSuperAdmin && isNotSelf;
  }

  getProfileImageUrl(path?: string): string {
    return path ? this.publicService.getImageUrl(path) : 'assets/default-pfp.png';
  }

  loadUsers(page: number = 0): void {
    this.currentPage = page;
    this.userService.getAllUsers(this.currentPage, this.selectedRole).subscribe({
      next: (res) => {
        this.users = res.content;
        this.totalPages = res.totalPages;
      }
    });
  }

  onFilterChange(role: string): void {
    this.selectedRole = role;
    this.loadUsers(0);
  }

  onRoleChange(userId: number, role: string): void {
    this.pendingUpdate = { userId, newRole: role };
  }

  confirmRoleUpdate(): void {
    if (this.pendingUpdate) {
      this.userService.updateUserRole(this.pendingUpdate.userId, this.pendingUpdate.newRole).subscribe({
        next: () => {
          this.loadUsers(this.currentPage);
          this.pendingUpdate = null;
        },
        error: (err) => {
          alert(err.error?.message || "Action not allowed");
          this.pendingUpdate = null;
        }
      });
    }
  }
  cancelUpdate(): void {
    this.pendingUpdate = null;
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
