import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class StudentsComponent implements OnInit {
  private apiService = inject(ApiService);
  
  protected students = signal<any[]>([]);
  protected loading = signal<boolean>(true);

  ngOnInit() {
    this.loadStudents();
  }

  private loadStudents() {
    this.loading.set(true);
    this.apiService.get<any>('/api/v1/students').subscribe({
      next: (res) => {
        if (res && res.data) {
          const content = res.data.content || res.data;
          this.students.set(Array.isArray(content) ? content : []);
        }
      },
      error: (err) => console.error('Failed to load students', err),
      complete: () => this.loading.set(false)
    });
  }
}
