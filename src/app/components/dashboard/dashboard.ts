import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  
  protected stats = signal<any>({
    centersCount: 0,
    coursesCount: 0,
    trainersCount: 0,
    studentsCount: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  private loadStats() {
    this.apiService.get<any>('/api/v1/dashboard/stats').subscribe({
      next: (data) => {
        if (data && data.success && data.data) {
          this.stats.set(data.data);
        }
      },
      error: (err) => console.error('Failed to load stats', err)
    });
  }
}
