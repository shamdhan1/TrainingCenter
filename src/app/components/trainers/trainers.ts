import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainers.html',
  styleUrl: './trainers.css'
})
export class TrainersComponent implements OnInit {
  private apiService = inject(ApiService);
  
  // Lists
  protected trainers = signal<any[]>([]);
  protected centers = signal<any[]>([]);
  protected loading = signal<boolean>(true);

  // Filters
  protected searchQuery = signal<string>('');
  protected selectedStatus = signal<string>('');
  protected selectedCenterId = signal<string>('');

  // Pagination
  protected currentPage = signal<number>(0);
  protected totalPages = signal<number>(0);
  protected totalElements = signal<number>(0);
  protected pageSize = signal<number>(10);

  ngOnInit() {
    this.loadCenters();
    this.loadTrainers();
  }

  private loadCenters() {
    this.apiService.get<any>('/api/v1/centers').subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          this.centers.set(res.data);
        }
      },
      error: (err) => console.error('Failed to load centers list', err)
    });
  }

  protected loadTrainers() {
    this.loading.set(true);
    
    // Construct query parameters
    let endpoint = `/api/v1/trainers?page=${this.currentPage()}&size=${this.pageSize()}`;
    if (this.searchQuery().trim()) {
      endpoint += `&query=${encodeURIComponent(this.searchQuery().trim())}`;
    }
    if (this.selectedStatus()) {
      endpoint += `&status=${this.selectedStatus()}`;
    }
    if (this.selectedCenterId()) {
      endpoint += `&centerId=${this.selectedCenterId()}`;
    }

    this.apiService.get<any>(endpoint).subscribe({
      next: (res) => {
        if (res && res.data) {
          const content = res.data.content || res.data;
          this.trainers.set(Array.isArray(content) ? content : []);
          
          // Set pagination metadata
          this.totalPages.set(res.data.totalPages || 0);
          this.totalElements.set(res.data.totalElements || 0);
        }
      },
      error: (err) => console.error('Failed to load trainers', err),
      complete: () => this.loading.set(false)
    });
  }

  protected onSearch() {
    this.currentPage.set(0); // Reset to first page
    this.loadTrainers();
  }

  protected onReset() {
    this.searchQuery.set('');
    this.selectedStatus.set('');
    this.selectedCenterId.set('');
    this.currentPage.set(0);
    this.loadTrainers();
  }

  protected nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
      this.loadTrainers();
    }
  }

  protected prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.loadTrainers();
    }
  }
}
