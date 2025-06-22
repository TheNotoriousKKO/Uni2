import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { TeacherService, CreateSubjectRequest, CreateGradeRequest } from '../../core/teacher.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div class="user-info">
          <span>Welcome, {{ username }}</span>
          <button (click)="logout()" class="btn btn-secondary">Logout</button>
        </div>
      </header>
      
      <main class="dashboard-content">
        <div class="dashboard-grid">
          <!-- Create Subject Form -->
          <div class="dashboard-card">
            <h2>Create New Subject</h2>
            <form [formGroup]="subjectForm" (ngSubmit)="createSubject()">
              <div class="form-group">
                <label for="subjectName">Subject Name</label>
                <input 
                  type="text" 
                  id="subjectName" 
                  formControlName="name" 
                  class="form-control"
                  [class.error]="isFieldInvalid('name')"
                  placeholder="Enter subject name"
                >
                <div class="error-message" *ngIf="isFieldInvalid('name')">
                  Subject name is required
                </div>
              </div>

              <div class="form-group">
                <label for="subjectCode">Subject Code</label>
                <input 
                  type="text" 
                  id="subjectCode" 
                  formControlName="code" 
                  class="form-control"
                  [class.error]="isFieldInvalid('code')"
                  placeholder="Enter subject code (e.g., MATH101)"
                >
                <div class="error-message" *ngIf="isFieldInvalid('code')">
                  Subject code is required
                </div>
              </div>

              <div class="error-message" *ngIf="subjectError">
                {{ subjectError }}
              </div>

              <div class="success-message" *ngIf="subjectSuccess">
                {{ subjectSuccess }}
              </div>

              <button 
                type="submit" 
                class="btn btn-primary" 
                [disabled]="subjectForm.invalid || isCreatingSubject"
              >
                {{ isCreatingSubject ? 'Creating...' : 'Create Subject' }}
              </button>
            </form>
          </div>

          <!-- Assign Grade Form -->
          <div class="dashboard-card">
            <h2>Assign Grade</h2>
            <form [formGroup]="gradeForm" (ngSubmit)="assignGrade()">
              <div class="form-group">
                <label for="studentId">Student ID</label>
                <input 
                  type="number" 
                  id="studentId" 
                  formControlName="studentId" 
                  class="form-control"
                  [class.error]="isFieldInvalid('studentId')"
                  placeholder="Enter student ID"
                >
                <div class="error-message" *ngIf="isFieldInvalid('studentId')">
                  Student ID is required
                </div>
              </div>

              <div class="form-group">
                <label for="subjectId">Subject ID</label>
                <input 
                  type="number" 
                  id="subjectId" 
                  formControlName="subjectId" 
                  class="form-control"
                  [class.error]="isFieldInvalid('subjectId')"
                  placeholder="Enter subject ID"
                >
                <div class="error-message" *ngIf="isFieldInvalid('subjectId')">
                  Subject ID is required
                </div>
              </div>

              <div class="form-group">
                <label for="gradeValue">Grade Value</label>
                <input 
                  type="number" 
                  id="gradeValue" 
                  formControlName="value" 
                  class="form-control"
                  [class.error]="isFieldInvalid('value')"
                  placeholder="Enter grade (1.0 - 6.0)"
                  step="0.1"
                  min="1.0"
                  max="6.0"
                >
                <div class="error-message" *ngIf="isFieldInvalid('value')">
                  Grade must be between 1.0 and 6.0
                </div>
              </div>

              <div class="error-message" *ngIf="gradeError">
                {{ gradeError }}
              </div>

              <div class="success-message" *ngIf="gradeSuccess">
                {{ gradeSuccess }}
              </div>

              <button 
                type="submit" 
                class="btn btn-primary" 
                [disabled]="gradeForm.invalid || isAssigningGrade"
              >
                {{ isAssigningGrade ? 'Assigning...' : 'Assign Grade' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Instructions Card -->
        <div class="dashboard-card instructions-card">
          <h2>Instructions</h2>
          <div class="instructions-content">
            <div class="instruction-section">
              <h3>Creating Subjects</h3>
              <ul>
                <li>Enter a descriptive subject name</li>
                <li>Use a unique subject code (e.g., MATH101, CS201)</li>
                <li>You will be automatically assigned as the teacher</li>
              </ul>
            </div>
            <div class="instruction-section">
              <h3>Assigning Grades</h3>
              <ul>
                <li>Enter the student's ID number</li>
                <li>Enter the subject ID you want to grade</li>
                <li>Grade values range from 1.0 to 6.0</li>
                <li>Students must be enrolled in the subject to receive grades</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .dashboard-header {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dashboard-header h1 {
      margin: 0;
      color: #333;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info span {
      color: #666;
    }

    .dashboard-content {
      padding: 2rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto 2rem auto;
    }

    .dashboard-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .dashboard-card h2 {
      color: #333;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #f8f9fa;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .form-control.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .success-message {
      color: #28a745;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      padding: 0.5rem;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
    }

    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-top: 1rem;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
    }

    .instructions-card {
      max-width: 1200px;
      margin: 0 auto;
    }

    .instructions-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .instruction-section h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .instruction-section ul {
      list-style-type: none;
      padding: 0;
    }

    .instruction-section li {
      padding: 0.5rem 0;
      color: #666;
      position: relative;
      padding-left: 1.5rem;
    }

    .instruction-section li:before {
      content: "•";
      color: #007bff;
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .instructions-content {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .dashboard-content {
        padding: 1rem;
      }

      .dashboard-header {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class TeacherDashboardComponent implements OnInit {
  username: string | null = null;
  subjectForm: FormGroup;
  gradeForm: FormGroup;
  isCreatingSubject = false;
  isAssigningGrade = false;
  subjectError = '';
  subjectSuccess = '';
  gradeError = '';
  gradeSuccess = '';

  constructor(
    private authService: AuthService,
    private teacherService: TeacherService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.username = this.authService.getUsernameFromToken();
    
    this.subjectForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]]
    });

    this.gradeForm = this.fb.group({
      studentId: ['', [Validators.required, Validators.min(1)]],
      subjectId: ['', [Validators.required, Validators.min(1)]],
      value: ['', [Validators.required, Validators.min(1.0), Validators.max(6.0)]]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  createSubject(): void {
    if (this.subjectForm.invalid) {
      return;
    }

    this.isCreatingSubject = true;
    this.subjectError = '';
    this.subjectSuccess = '';

    const request: CreateSubjectRequest = this.subjectForm.value;

    this.teacherService.createSubject(request).subscribe({
      next: (subject) => {
        this.isCreatingSubject = false;
        this.subjectSuccess = `Subject "${subject.name}" (${subject.code}) created successfully!`;
        this.subjectForm.reset();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.subjectSuccess = '';
        }, 3000);
      },
      error: (error) => {
        this.isCreatingSubject = false;
        this.subjectError = error.error?.message || 'Failed to create subject. Please try again.';
      }
    });
  }

  assignGrade(): void {
    if (this.gradeForm.invalid) {
      return;
    }

    this.isAssigningGrade = true;
    this.gradeError = '';
    this.gradeSuccess = '';

    const request: CreateGradeRequest = {
      studentId: this.gradeForm.value.studentId,
      subjectId: this.gradeForm.value.subjectId,
      value: this.gradeForm.value.value
    };

    this.teacherService.assignGrade(request).subscribe({
      next: (grade) => {
        this.isAssigningGrade = false;
        this.gradeSuccess = `Grade ${grade.value} assigned successfully!`;
        this.gradeForm.reset();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.gradeSuccess = '';
        }, 3000);
      },
      error: (error) => {
        this.isAssigningGrade = false;
        this.gradeError = error.error?.message || 'Failed to assign grade. Please try again.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.subjectForm.get(fieldName) || this.gradeForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
} 