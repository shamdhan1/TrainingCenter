import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface Center {
  centerId: number;
  name: string;
}

@Component({
  selector: 'app-trainer-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainer-registration.html',
  styleUrl: './trainer-registration.css'
})
export class TrainerRegistrationComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  protected centers = signal<Center[]>([]);
  protected loading = signal(false);
  protected submitted = signal(false);

  protected trainer = {
    username: '',
    password: '',
    name: '',
    email: '',
    mobile: '',
    employeeCode: '',
    specialization: '',
    qualification: '',
    experienceYears: null as number | null,
    joiningDate: this.getToday(),
    centerId: null as number | null,
    status: 'ACTIVE'
  };

  ngOnInit(): void {
    this.loadCenters();
    this.generateEmployeeCode();
  }

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  private loadCenters(): void {
    this.apiService.get<any>('/api/v1/centers').subscribe({
      next: (response) => {
        this.centers.set(response.data || []);
      },
      error: (error) => {
        console.error('Failed to load centers', error);
      }
    });
  }

  private generateEmployeeCode(): void {
    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    this.trainer.employeeCode = `EMP-${new Date().getFullYear()}-${uniqueNum}`;
  }

  protected submitRegistration(): void {
    this.submitted.set(true);

    if (
      !this.trainer.username ||
      !this.trainer.password ||
      !this.trainer.name ||
      !this.trainer.email ||
      !this.trainer.mobile ||
      !this.trainer.centerId ||
      !this.trainer.employeeCode
    ) {
      alert('Please fill all required fields.');
      return;
    }

    this.loading.set(true);

    const request = {
      ...this.trainer,
      centerId: Number(this.trainer.centerId),
      experienceYears: this.trainer.experienceYears ? Number(this.trainer.experienceYears) : null
    };

    this.apiService.post<any>('/api/v1/trainers/register', request).subscribe({
      next: (response) => {
        console.log('Trainer registered successfully', response);
        alert(`Trainer registered successfully!\nEmployee Code: ${response.data.employeeCode}`);
        this.router.navigate(['/trainers']);
      },
      error: (error) => {
        console.error('Trainer registration failed', error);
        const message = error?.error?.message || 'Registration failed. Please check the entered data.';
        alert(message);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  protected resetForm(): void {
    this.trainer = {
      username: '',
      password: '',
      name: '',
      email: '',
      mobile: '',
      employeeCode: '',
      specialization: '',
      qualification: '',
      experienceYears: null,
      joiningDate: this.getToday(),
      centerId: null,
      status: 'ACTIVE'
    };
    this.generateEmployeeCode();
    this.submitted.set(false);
  }
}