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
import { TrainerReportsComponent } from './components/trainer-reports/trainer-reports';
import { authGuard } from './services/auth.guard';
import { loginGuard } from './services/login.guard';
import { roleGuard } from './services/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'centers',
    component: CentersListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_CENTER_MANAGER'] }
  },
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_CENTER_MANAGER', 'ROLE_TRAINER', 'ROLE_STUDENT'] }
  },
  {
    path: 'trainers',
    component: TrainersComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_CENTER_MANAGER'] }
  },
  {
    path: 'students',
    component: StudentsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_CENTER_MANAGER', 'ROLE_TRAINER'] }
  },
  {
    path: 'batches',
    component: BatchesComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_CENTER_MANAGER', 'ROLE_TRAINER', 'ROLE_STUDENT'] }
  },
  {
    path: 'admissions',
    component: AdmissionsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_CENTER_MANAGER'] }
  },
  {
    path: 'trainer-registration',
    component: TrainerRegistrationComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'trainer-reports',
    component: TrainerReportsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_TRAINER'] }
  },
  { path: '**', redirectTo: 'dashboard' }
];
