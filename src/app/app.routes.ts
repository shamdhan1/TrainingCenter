import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CentersListComponent } from './features/centers/pages/centers-list';
import { CoursesComponent } from './components/courses/courses';
import { TrainersComponent } from './components/trainers/trainers';
import { StudentsComponent } from './components/students/students';
import { BatchesComponent } from './components/batches/batches';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'centers', component: CentersListComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'trainers', component: TrainersComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'batches', component: BatchesComponent }
];
