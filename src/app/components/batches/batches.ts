import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-batches',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './batches.html',
  styleUrl: './batches.css'
})
export class BatchesComponent implements OnInit {
  private apiService = inject(ApiService);
  
  protected batches = signal<any[]>([]);
  protected loading = signal<boolean>(true);

  ngOnInit() {
    this.loadBatches();
  }

  private loadBatches() {
    this.loading.set(true);
    this.apiService.get<any>('/api/v1/batches').subscribe({
      next: (res) => {
        if (res && res.data) {
          const content = res.data.content || res.data;
          this.batches.set(Array.isArray(content) ? content : []);
        }
      },
      error: (err) => console.error('Failed to load batches', err),
      complete: () => this.loading.set(false)
    });
  }
}
