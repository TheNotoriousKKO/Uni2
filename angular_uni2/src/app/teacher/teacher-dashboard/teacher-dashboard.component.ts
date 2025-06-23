import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { TeacherService, CreateSubjectRequest, CreateGradeRequest, Subject, Student } from '../../core/teacher.service';
import { UserService, UserDto } from '../../core/user.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div class="user-info">
          <span>Welcome, {{ currentUser?.firstName }} {{ currentUser?.lastName }} (ID: {{ currentUser?.id }})</span>
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

        <!-- Subject Search and Enrollment Management -->
        <div class="dashboard-card enrollment-card">
          <h2>Student Enrollment Management</h2>
          
          <!-- Subject Search -->
          <div class="search-section">
            <h3>Search Subjects</h3>
            <form [formGroup]="searchForm" (ngSubmit)="searchSubjects()">
              <div class="search-inputs">
                <div class="form-group">
                  <label for="searchSubjectId">Subject ID</label>
                  <input 
                    type="number" 
                    id="searchSubjectId" 
                    formControlName="subjectId" 
                    class="form-control"
                    placeholder="Enter subject ID"
                  >
                </div>
                <div class="form-group">
                  <label for="searchSubjectCode">Subject Code</label>
                  <input 
                    type="text" 
                    id="searchSubjectCode" 
                    formControlName="subjectCode" 
                    class="form-control"
                    placeholder="Enter subject code"
                  >
                </div>
                <div class="form-group">
                  <label for="searchSubjectName">Subject Name</label>
                  <input 
                    type="text" 
                    id="searchSubjectName" 
                    formControlName="subjectName" 
                    class="form-control"
                    placeholder="Enter subject name (partial match)"
                  >
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="isSearching">
                  {{ isSearching ? 'Searching...' : 'Search' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Search Results -->
          <div class="search-results" *ngIf="searchResults.length > 0">
            <h3>Search Results</h3>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let subject of searchResults">
                    <td>{{ subject.id }}</td>
                    <td>{{ subject.code }}</td>
                    <td>{{ subject.name }}</td>
                    <td>
                      <button (click)="selectSubject(subject)" class="btn btn-secondary btn-sm">
                        Select
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Selected Subject and Student Management -->
          <div class="selected-subject" *ngIf="selectedSubject">
            <h3>Managing: {{ selectedSubject.name }} ({{ selectedSubject.code }})</h3>
            
            <!-- Enroll Student Form -->
            <div class="enroll-section">
              <h4>Enroll New Student</h4>
              <form [formGroup]="enrollForm" (ngSubmit)="enrollStudent()">
                <div class="enroll-inputs">
                  <div class="form-group">
                    <label for="enrollStudentId">Student ID</label>
                    <input 
                      type="number" 
                      id="enrollStudentId" 
                      formControlName="studentId" 
                      class="form-control"
                      [class.error]="isFieldInvalid('enrollStudentId')"
                      placeholder="Enter student ID"
                    >
                    <div class="error-message" *ngIf="isFieldInvalid('enrollStudentId')">
                      Student ID is required
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary" [disabled]="enrollForm.invalid || isEnrolling">
                    {{ isEnrolling ? 'Enrolling...' : 'Enroll' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Enrolled Students List -->
            <div class="enrolled-students">
              <h4>Enrolled Students</h4>
              <div class="loading-container" *ngIf="isLoadingStudents">
                <div class="loading-spinner"></div>
                <p>Loading students...</p>
              </div>
              
              <div class="table-container" *ngIf="!isLoadingStudents">
                <table class="data-table" *ngIf="enrolledStudents.length > 0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let student of enrolledStudents">
                      <td>{{ student.id }}</td>
                      <td>{{ student.firstName }} {{ student.lastName }}</td>
                      <td>{{ student.username }}</td>
                      <td>
                        <button (click)="removeStudent(student.id)" class="btn btn-danger btn-sm" [disabled]="isRemovingStudent === student.id">
                          {{ isRemovingStudent === student.id ? 'Removing...' : 'Remove' }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="empty-state" *ngIf="enrolledStudents.length === 0">
                  <p>No students enrolled in this subject.</p>
                </div>
              </div>
            </div>

            <div class="error-message" *ngIf="enrollmentError">
              {{ enrollmentError }}
            </div>

            <div class="success-message" *ngIf="enrollmentSuccess">
              {{ enrollmentSuccess }}
            </div>
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
            <div class="instruction-section">
              <h3>Managing Enrollment</h3>
              <ul>
                <li>Search for subjects by ID, code, or name</li>
                <li>Name search supports partial matching (e.g., "math" finds "Advanced Mathematics")</li>
                <li>Select a subject to manage its enrollment</li>
                <li>Enroll students by entering their ID</li>
                <li>Remove students using the Remove button</li>
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

    .enrollment-card {
      max-width: 1200px;
      margin: 0 auto 2rem auto;
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
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s;
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
      background-color: #545b62;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #c82333;
    }

    .btn-sm {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
    }

    .search-section {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .search-section h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .search-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 1rem;
      align-items: end;
    }

    .search-results {
      margin-bottom: 2rem;
    }

    .search-results h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .selected-subject {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .selected-subject h3 {
      color: #333;
      margin-bottom: 1.5rem;
    }

    .enroll-section {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .enroll-section h4 {
      color: #333;
      margin-bottom: 1rem;
    }

    .enroll-inputs {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1rem;
      align-items: end;
    }

    .enrolled-students h4 {
      color: #333;
      margin-bottom: 1rem;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .data-table th,
    .data-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .data-table th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #333;
    }

    .data-table tr:hover {
      background-color: #f8f9fa;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      gap: 1rem;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .instructions-card {
      max-width: 1200px;
      margin: 0 auto;
    }

    .instructions-content {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 2rem;
    }

    .instruction-section h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .instruction-section ul {
      list-style-type: none;
      padding: 0;
    }

    .instruction-section li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
      color: #666;
    }

    .instruction-section li:last-child {
      border-bottom: none;
    }

    .instruction-section li:before {
      content: "•";
      color: #007bff;
      font-weight: bold;
      margin-right: 0.5rem;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .search-inputs {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .enroll-inputs {
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
  currentUser: UserDto | null = null;
  subjectForm: FormGroup;
  gradeForm: FormGroup;
  searchForm: FormGroup;
  enrollForm: FormGroup;
  
  // Subject management
  searchResults: Subject[] = [];
  selectedSubject: Subject | null = null;
  enrolledStudents: Student[] = [];
  
  // Loading states
  isCreatingSubject = false;
  isAssigningGrade = false;
  isSearching = false;
  isEnrolling = false;
  isLoadingStudents = false;
  isRemovingStudent: number | null = null;
  
  // Messages
  subjectError = '';
  subjectSuccess = '';
  gradeError = '';
  gradeSuccess = '';
  enrollmentError = '';
  enrollmentSuccess = '';

  constructor(
    private authService: AuthService,
    private teacherService: TeacherService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.subjectForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]]
    });

    this.gradeForm = this.fb.group({
      studentId: ['', [Validators.required, Validators.min(1)]],
      subjectId: ['', [Validators.required, Validators.min(1)]],
      value: ['', [Validators.required, Validators.min(1.0), Validators.max(6.0)]]
    });

    this.searchForm = this.fb.group({
      subjectId: [''],
      subjectCode: [''],
      subjectName: ['']
    });

    this.enrollForm = this.fb.group({
      studentId: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      }
    });
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
      next: (response) => {
        this.isCreatingSubject = false;
        this.subjectSuccess = 'Subject created successfully!';
        this.subjectForm.reset();
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

    const request: CreateGradeRequest = this.gradeForm.value;

    this.teacherService.assignGrade(request).subscribe({
      next: (response) => {
        this.isAssigningGrade = false;
        this.gradeSuccess = 'Grade assigned successfully!';
        this.gradeForm.reset();
      },
      error: (error) => {
        this.isAssigningGrade = false;
        this.gradeError = error.error?.message || 'Failed to assign grade. Please try again.';
      }
    });
  }

  searchSubjects(): void {
    const formValue = this.searchForm.value;
    const query: any = {};
    
    if (formValue.subjectId) {
      query.id = formValue.subjectId;
    } else if (formValue.subjectCode) {
      query.code = formValue.subjectCode;
    } else if (formValue.subjectName) {
      query.name = formValue.subjectName;
    } else {
      // If no search criteria, show all subjects
      query.code = '';
    }

    this.isSearching = true;
    this.searchResults = [];

    this.teacherService.searchSubjects(query).subscribe({
      next: (subjects) => {
        this.isSearching = false;
        this.searchResults = subjects;
      },
      error: (error) => {
        this.isSearching = false;
        console.error('Error searching subjects:', error);
        this.enrollmentError = 'Failed to search subjects. Please try again.';
      }
    });
  }

  selectSubject(subject: Subject): void {
    this.selectedSubject = subject;
    this.loadEnrolledStudents();
    this.clearEnrollmentMessages();
  }

  loadEnrolledStudents(): void {
    if (!this.selectedSubject) return;

    this.isLoadingStudents = true;
    this.enrolledStudents = [];

    this.teacherService.getEnrolledStudents(this.selectedSubject.id).subscribe({
      next: (students) => {
        this.isLoadingStudents = false;
        this.enrolledStudents = students;
      },
      error: (error) => {
        this.isLoadingStudents = false;
        console.error('Error loading enrolled students:', error);
        this.enrollmentError = 'Failed to load enrolled students. Please try again.';
      }
    });
  }

  enrollStudent(): void {
    if (this.enrollForm.invalid || !this.selectedSubject) {
      return;
    }

    this.isEnrolling = true;
    this.clearEnrollmentMessages();

    const studentId = this.enrollForm.get('studentId')?.value;

    this.teacherService.enrollStudent(this.selectedSubject.id, studentId).subscribe({
      next: () => {
        this.isEnrolling = false;
        this.enrollmentSuccess = 'Student enrolled successfully!';
        this.enrollForm.reset();
        this.loadEnrolledStudents(); // Refresh the list
      },
      error: (error) => {
        this.isEnrolling = false;
        this.enrollmentError = error.error?.message || 'Failed to enroll student. Please try again.';
      }
    });
  }

  removeStudent(studentId: number): void {
    if (!this.selectedSubject) return;

    this.isRemovingStudent = studentId;
    this.clearEnrollmentMessages();

    this.teacherService.removeStudent(this.selectedSubject.id, studentId).subscribe({
      next: () => {
        this.isRemovingStudent = null;
        this.enrollmentSuccess = 'Student removed successfully!';
        this.loadEnrolledStudents(); // Refresh the list
      },
      error: (error) => {
        this.isRemovingStudent = null;
        this.enrollmentError = error.error?.message || 'Failed to remove student. Please try again.';
      }
    });
  }

  clearEnrollmentMessages(): void {
    this.enrollmentError = '';
    this.enrollmentSuccess = '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.subjectForm.get(fieldName) || 
                   this.gradeForm.get(fieldName) || 
                   this.searchForm.get(fieldName) || 
                   this.enrollForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
} 