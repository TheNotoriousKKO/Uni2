import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard, StudentGuard, TeacherGuard } from './core/auth.guard';
import { LandingPageComponent } from './landing/landing.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'student', 
    loadChildren: () => import('./student/student.routes').then(m => m.STUDENT_ROUTES),
    canActivate: [StudentGuard]
  },
  { 
    path: 'teacher', 
    loadChildren: () => import('./teacher/teacher.routes').then(m => m.TEACHER_ROUTES),
    canActivate: [TeacherGuard]
  },
  { path: '**', redirectTo: '' }
];
