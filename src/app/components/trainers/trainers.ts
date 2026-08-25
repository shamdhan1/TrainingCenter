import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trainers.html',
  styleUrl: './trainers.css'
})
export class TrainersComponent implements OnInit {
  private apiService = inject(ApiService);
  
  protected trainers = signal<any[]>([]);
  protected loading = signal<boolean>(true);

  ngOnInit() {
    this.loadTrainers();
  }

  private loadTrainers() {
    this.loading.set(true);
    this.apiService.get<any>('/api/v1/trainers').subscribe({
      next: (res) => {
        if (res && res.data) {
          const content = res.data.content || res.data;
          this.trainers.set(Array.isArray(content) ? content : []);
        }
      },
      error: (err) => console.error('Failed to load trainers', err),
      complete: () => this.loading.set(false)
    });
  }
}
