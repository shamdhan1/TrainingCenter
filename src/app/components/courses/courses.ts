import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class CoursesComponent implements OnInit {
  private apiService = inject(ApiService);

  // Lists
  protected courses = signal<any[]>([]);
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
    this.loadCourses();
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

  protected loadCourses() {
    this.loading.set(true);

    // Call the paginated search endpoint: /api/v1/courses/search
    let endpoint = `/api/v1/courses/search?page=${this.currentPage()}&size=${this.pageSize()}`;
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
          this.courses.set(Array.isArray(content) ? content : []);

          this.totalPages.set(res.data.totalPages || 0);
          this.totalElements.set(res.data.totalElements || 0);
        }
      },
      error: (err) => console.error('Failed to load courses', err),
      complete: () => this.loading.set(false)
    });
  }

  protected onSearch() {
    this.currentPage.set(0); // Reset to first page
    this.loadCourses();
  }

  protected onReset() {
    this.searchQuery.set('');
    this.selectedStatus.set('');
    this.selectedCenterId.set('');
    this.currentPage.set(0);
    this.loadCourses();
  }

  protected nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
      this.loadCourses();
    }
  }

  protected prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.loadCourses();
    }
  }
}
