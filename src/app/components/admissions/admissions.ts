import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface Center {
  centerId: number;
  name: string;
}

interface Course {
  courseId: number;
  courseCode: string;
  courseName: string;
  totalFee: number;
  centerId?: number;
  centerName?: string;
}

interface Trainer {
  trainerId: number;
  name: string;
  specialization?: string;
}

@Component({
  selector: 'app-admissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admissions.html',
  styleUrl: './admissions.css'
})
export class AdmissionsComponent implements OnInit {

  private apiService = inject(ApiService);
  private router = inject(Router);

  protected centers = signal<Center[]>([]);
  protected courses = signal<Course[]>([]);
  protected trainers = signal<Trainer[]>([]);

  protected loading = signal(false);
  protected submitted = signal(false);

  protected selectedCourseFee = signal(0);
  protected netFee = signal(0);
  protected remainingFee = signal(0);

  protected admission = {
    username: '',
    password: '',

    centerId: null as number | null,

    registrationNo: '',
    firstName: '',
    lastName: '',

    dateOfBirth: '',
    gender: '',

    mobile: '',
    email: '',

    fatherName: '',
    motherName: '',
    guardianName: '',
    guardianMobile: '',

    aadhaarNo: '',

    qualification: '',
    address: '',
    city: '',
    state: '',
    pincode: '',

    registrationDate: this.getToday(),
    status: 'ACTIVE',

    courseId: null as number | null,
    trainerId: null as number | null,

    startDate: '',
    expectedEndDate: '',

    discount: 0,
    initialPayment: 0,

    paymentMode: 'CASH',
    transactionReference: '',

    feeDueDate: '',
    remarks: ''
  };

  ngOnInit(): void {
    this.loadCenters();
    this.loadCourses();
    this.loadTrainers();
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

  private loadCourses(): void {
    this.apiService.get<any>('/api/v1/courses').subscribe({
      next: (response) => {
        this.courses.set(response.data || []);
      },
      error: (error) => {
        console.error('Failed to load courses', error);
      }
    });
  }

  private loadTrainers(): void {
    this.apiService.get<any>('/api/v1/trainers').subscribe({
      next: (response) => {
        const data = response.data;

        if (Array.isArray(data)) {
          this.trainers.set(data);
        } else {
          this.trainers.set(data?.content || []);
        }
      },
      error: (error) => {
        console.error('Failed to load trainers', error);
      }
    });
  }

  protected onCourseChange(): void {

    if (!this.admission.courseId) {
      this.selectedCourseFee.set(0);
      this.calculateFees();
      return;
    }

    const course = this.courses().find(
      c => c.courseId === Number(this.admission.courseId)
    );

    if (course) {
      this.selectedCourseFee.set(Number(course.totalFee || 0));
      this.calculateFees();
    }
  }

  protected calculateFees(): void {

    const courseFee = this.selectedCourseFee();

    const discount = Number(this.admission.discount || 0);
    const initialPayment = Number(this.admission.initialPayment || 0);

    const calculatedNetFee = Math.max(courseFee - discount, 0);

    const calculatedRemaining =
      Math.max(calculatedNetFee - initialPayment, 0);

    this.netFee.set(calculatedNetFee);
    this.remainingFee.set(calculatedRemaining);
  }

  protected submitAdmission(): void {

    this.submitted.set(true);
    const uniqueRegNo = 'REG-' + new Date().getTime();


    if (
      !this.admission.centerId ||
      !this.admission.courseId ||
      !this.admission.firstName ||
      !this.admission.lastName ||
      !this.admission.mobile ||
      !this.admission.email
    ) {
      alert('Please fill all required fields.');
      return;
    }

    this.loading.set(true);

    const request = {
      ...this.admission,
      registrationNo: uniqueRegNo,

      centerId: Number(this.admission.centerId),
      courseId: Number(this.admission.courseId),

      trainerId: this.admission.trainerId
        ? Number(this.admission.trainerId)
        : null,

      discount: Number(this.admission.discount || 0),
      initialPayment: Number(this.admission.initialPayment || 0)
    };

    this.apiService.post<any>(
      '/api/v1/admissions',
      request
    ).subscribe({

      next: (response) => {

        console.log('Admission created successfully', response);

        alert(
          `Admission successful!\nRegistration No: ${response.data.registrationNo}`
        );

        this.router.navigate(['/admissions']);

      },

      error: (error) => {

        console.error('Admission failed', error);

        const message =
          error?.error?.message ||
          'Admission failed. Please check the entered data.';

        alert(message);

        this.loading.set(false);
      },

      complete: () => {
        this.loading.set(false);
      }

    });
  }

  protected resetForm(): void {

    this.admission = {
      username: '',
      password: '',

      centerId: null,

      registrationNo: '',
      firstName: '',
      lastName: '',

      dateOfBirth: '',
      gender: '',

      mobile: '',
      email: '',

      fatherName: '',
      motherName: '',
      guardianName: '',
      guardianMobile: '',

      aadhaarNo: '',

      qualification: '',
      address: '',
      city: '',
      state: '',
      pincode: '',

      registrationDate: this.getToday(),
      status: 'ACTIVE',

      courseId: null,
      trainerId: null,

      startDate: '',
      expectedEndDate: '',

      discount: 0,
      initialPayment: 0,

      paymentMode: 'CASH',
      transactionReference: '',

      feeDueDate: '',
      remarks: ''
    };

    this.selectedCourseFee.set(0);
    this.netFee.set(0);
    this.remainingFee.set(0);
  }
}
