import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { Router } from '@angular/router';

export interface UserProfile {
  userId: number;
  username: string;
  email: string;
  mobile?: string;
  status?: string;
  roles: string[];
  centerId?: number;
  studentId?: number;
  trainerId?: number;
}

export interface AuthResponseData {
  token: string;
  userId: number;
  username: string;
  email: string;
  roles: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Signals for global auth state
  readonly currentUser = signal<UserProfile | null>(null);
  readonly isAuthenticated = signal<boolean>(false);
  readonly loading = signal<boolean>(true);

  constructor() {
    this.checkInitialAuth();
  }

  private checkInitialAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticated.set(true);
      // Fetch fresh profile data
      this.fetchProfile().subscribe({
        next: (profile) => {
          this.currentUser.set(profile);
          this.loading.set(false);
        },
        error: () => {
          // Token invalid/expired
          this.clearSession();
          this.loading.set(false);
        }
      });
    } else {
      this.isAuthenticated.set(false);
      this.loading.set(false);
    }
  }

  login(credentials: { username: string; password: string }): Observable<ApiResponse<AuthResponseData>> {
    this.loading.set(true);
    return this.http.post<ApiResponse<AuthResponseData>>('/api/v1/auth/login', credentials).pipe(
      tap(response => {
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token);
          this.isAuthenticated.set(true);
          // Pre-populate user fields from login response
          const initialProfile: UserProfile = {
            userId: response.data.userId,
            username: response.data.username,
            email: response.data.email,
            roles: response.data.roles
          };
          this.currentUser.set(initialProfile);

          // Fetch full profile details
          this.fetchProfile().subscribe({
            next: (profile) => {
              this.currentUser.set(profile);
            }
          });
        }
        this.loading.set(false);
      }),
      catchError(error => {
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  fetchProfile(): Observable<UserProfile> {
    return this.http.get<ApiResponse<UserProfile>>('/api/v1/auth/me').pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch user profile');
      }),
      tap({
        next: (profile) => {
          this.currentUser.set(profile);
        },
        error: () => {
          this.clearSession();
        }
      })
    );
  }

  logout() {
    this.http.post('/api/v1/auth/logout', {}).subscribe({
      next: () => this.clearSessionAndRedirect(),
      error: () => this.clearSessionAndRedirect()
    });
  }

  private clearSession() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  private clearSessionAndRedirect() {
    this.clearSession();
    this.router.navigate(['/login']);
  }
}
