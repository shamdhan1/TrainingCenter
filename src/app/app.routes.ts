import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CentersListComponent } from './features/centers/pages/centers-list';
import { CoursesComponent } from './components/courses/courses';
import { TrainersComponent } from './components/trainers/trainers';
import { StudentsComponent } from './components/students/students';
import { BatchesComponent } from './components/batches/batches';
import { AdmissionsComponent } from './components/admissions/admissions';
import { TrainerRegistrationComponent } from './components/trainer-registration/trainer-registration';
import { LoginComponent } from './components/login/login';
import { authGuard } from './services/auth.guard';
import { loginGuard } from './services/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'centers', component: CentersListComponent, canActivate: [authGuard] },
  { path: 'courses', component: CoursesComponent, canActivate: [authGuard] },
  { path: 'trainers', component: TrainersComponent, canActivate: [authGuard] },
  { path: 'students', component: StudentsComponent, canActivate: [authGuard] },
  { path: 'batches', component: BatchesComponent, canActivate: [authGuard] },
  { path: 'admissions', component: AdmissionsComponent, canActivate: [authGuard] },
  { path: 'trainer-registration', component: TrainerRegistrationComponent, canActivate: [authGuard] }
];
