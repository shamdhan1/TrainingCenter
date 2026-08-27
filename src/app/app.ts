import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  readonly title = signal('frontend');
  private router = inject(Router);
  protected authService = inject(AuthService);

  protected currentScreen = signal('Dashboard');

  logout() {
    this.authService.logout();
  }

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.currentScreen.set(this.getScreenNameFromUrl(url));
    });
  }

  private getScreenNameFromUrl(url: string): string {
    const path = url.split('/')[1] || 'dashboard';
    switch (path) {
      case 'dashboard':
        return 'Dashboard';
      case 'admissions':
        return 'Student Admissions';
      case 'centers':
        return 'Training Centers';
      case 'courses':
        return 'Courses';
      case 'trainers':
        return 'Trainers';
      case 'students':
        return 'Students';
      case 'batches':
        return 'Batches';
      default:
        return 'Dashboard';
    }
  }
}
