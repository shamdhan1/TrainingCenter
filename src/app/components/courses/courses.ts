import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class CoursesComponent implements OnInit {
  private apiService = inject(ApiService);

  protected courses = signal<any[]>([]);

  ngOnInit() {
    this.loadCourses();
  }

  private loadCourses() {
    this.apiService.get<any>('/api/v1/courses').subscribe({
      next: (res) => {
        if (res && res.data) {
          this.courses.set(res.data);
        }
      },
      error: (err) => console.error('Failed to load courses', err)
    });
  }
}
