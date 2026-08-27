import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Form fields
  protected username = signal<string>('');
  protected password = signal<string>('');
  
  // UI States
  protected errorMessage = signal<string | null>(null);
  protected isLoading = signal<boolean>(false);

  onSubmit() {
    const userVal = this.username().trim();
    const passVal = this.password();

    if (!userVal || !passVal) {
      this.errorMessage.set('Please enter both username and password.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login({ username: userVal, password: passVal }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set(response.message || 'Authentication failed');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Login error', err);
        if (err.status === 401 || err.status === 403) {
          this.errorMessage.set('Invalid username or password.');
        } else {
          this.errorMessage.set(
            err.error?.message || 'Server connection failed. Please try again later.'
          );
        }
      }
    });
  }
}
