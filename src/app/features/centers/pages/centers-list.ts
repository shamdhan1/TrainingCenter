import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CenterService } from '../services/center.service';
import { Center } from '../models/center.model';

@Component({
  selector: 'app-centers-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './centers-list.html',
  styleUrl: './centers-list.css'
})
export class CentersListComponent implements OnInit {
  private centerService = inject(CenterService);

  // Lists
  protected centers = signal<Center[]>([]);
  protected loading = signal<boolean>(true);

  // Client-side search query
  protected searchQuery = signal<string>('');

  // Pagination
  protected currentPage = signal<number>(0);
  protected totalPages = signal<number>(0);
  protected totalElements = signal<number>(0);
  protected pageSize = signal<number>(10);

  // Computed signal to filter centers on current page locally by code/name
  protected filteredCenters = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.centers();
    }
    return this.centers().filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.centerCode.toLowerCase().includes(query) || 
      (c.address && c.address.toLowerCase().includes(query))
    );
  });

  ngOnInit() {
    this.loadCenters();
  }

  protected loadCenters() {
    this.loading.set(true);
    this.centerService.getCentersPaginated(this.currentPage(), this.pageSize()).subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          const content = res.data.content || [];
          this.centers.set(content);

          this.totalPages.set(res.data.totalPages || 0);
          this.totalElements.set(res.data.totalElements || 0);
        }
      },
      error: (err) => console.error('Failed to load paginated centers', err),
      complete: () => this.loading.set(false)
    });
  }

  protected onReset() {
    this.searchQuery.set('');
    this.currentPage.set(0);
    this.loadCenters();
  }

  protected nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
      this.loadCenters();
    }
  }

  protected prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.loadCenters();
    }
  }
}
