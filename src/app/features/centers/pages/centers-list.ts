import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterService } from '../services/center.service';
import { Center } from '../models/center.model';

@Component({
  selector: 'app-centers-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './centers-list.html',
  styleUrl: './centers-list.css'
})
export class CentersListComponent implements OnInit {

  private centerService = inject(CenterService);

  protected centers = signal<Center[]>([]);
  protected loading = signal<boolean>(true);

  ngOnInit() {
    this.loadCenters();
  }

  private loadCenters() {
    this.loading.set(true);
    this.centerService.getCenters().subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          this.centers.set(res.data);
        }
      },
      error: (err) => console.error('Failed to load centers', err),
      complete: () => this.loading.set(false)
    });
  }
}
