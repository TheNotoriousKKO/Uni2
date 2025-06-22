import { Routes } from '@angular/router';

export const TEACHER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent)
  }
]; 