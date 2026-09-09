import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-batches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './batches.html',
  styleUrl: './batches.css'
})
export class BatchesComponent implements OnInit {
  private apiService = inject(ApiService);
  
  // Lists
  protected batches = signal<any[]>([]);
  protected centers = signal<any[]>([]);
  protected loading = signal<boolean>(true);

  // Filters
  protected selectedCenterId = signal<string>('');

  // Pagination
  protected currentPage = signal<number>(0);
  protected totalPages = signal<number>(0);
  protected totalElements = signal<number>(0);
  protected pageSize = signal<number>(10);

  ngOnInit() {
    this.loadCenters();
    this.loadBatches();
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

  protected loadBatches() {
    this.loading.set(true);

    // Call the paginated endpoint: /api/v1/batches/paginated
    let endpoint = `/api/v1/batches/paginated?page=${this.currentPage()}&size=${this.pageSize()}`;
    if (this.selectedCenterId()) {
      endpoint += `&centerId=${this.selectedCenterId()}`;
    }

    this.apiService.get<any>(endpoint).subscribe({
      next: (res) => {
        if (res && res.data) {
          const content = res.data.content || res.data;
          this.batches.set(Array.isArray(content) ? content : []);

          this.totalPages.set(res.data.totalPages || 0);
          this.totalElements.set(res.data.totalElements || 0);
        }
      },
      error: (err) => console.error('Failed to load batches', err),
      complete: () => this.loading.set(false)
    });
  }

  protected onFilterChange() {
    this.currentPage.set(0); // Reset to first page on filter change
    this.loadBatches();
  }

  protected onReset() {
    this.selectedCenterId.set('');
    this.currentPage.set(0);
    this.loadBatches();
  }

  protected nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
      this.loadBatches();
    }
  }

  protected prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.loadBatches();
    }
  }
}
