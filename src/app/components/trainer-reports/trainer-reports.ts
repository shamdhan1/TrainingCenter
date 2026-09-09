import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-trainer-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainer-reports.html',
  styleUrl: './trainer-reports.css'
})
export class TrainerReportsComponent implements OnInit {
  private apiService = inject(ApiService);

  // Form selections
  protected trainers = signal<any[]>([]);
  protected selectedTrainerId = signal<string>('');
  protected fromDate = signal<string>('');
  protected toDate = signal<string>('');

  // UI States
  protected isLoading = signal<boolean>(false);
  protected error = signal<string | null>(null);
  protected reportData = signal<any | null>(null);

  ngOnInit() {
    this.setDefaultDates();
    this.loadTrainers();
  }

  private setDefaultDates() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    // Format to yyyy-MM-dd
    const formatDate = (date: Date) => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    };

    this.fromDate.set(formatDate(firstDay));
    this.toDate.set(formatDate(today));
  }

  private loadTrainers() {
    this.apiService.get<any[]>('/api/v1/trainers/all').subscribe({
      next: (data) => {
        // If data is wrapped in ApiResponse check success
        if (data && (data as any).success && (data as any).data) {
          this.trainers.set((data as any).data);
        } else if (Array.isArray(data)) {
          this.trainers.set(data);
        }
      },
      error: (err) => {
        console.error('Failed to load trainers', err);
        this.error.set('Failed to load trainers dropdown list. Please refresh the page.');
      }
    });
  }

  protected generateReport() {
    const trainerId = this.selectedTrainerId();
    const from = this.fromDate();
    const to = this.toDate();

    if (!trainerId) {
      this.error.set('Please select a trainer first.');
      return;
    }
    if (!from || !to) {
      this.error.set('Please fill in both dates.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.reportData.set(null);

    const endpoint = `/api/v1/trainer-reports/${trainerId}?fromDate=${from}&toDate=${to}`;
    
    this.apiService.get<any>(endpoint).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response && response.success && response.data) {
          this.reportData.set(response.data);
        } else {
          this.error.set(response?.message || 'Failed to generate report.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Failed to generate report', err);
        this.error.set(
          err.error?.message || 'Error occurred while generating report. Please check date formats.'
        );
      }
    });
  }
}
