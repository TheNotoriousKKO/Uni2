import { Component, OnInit, OnDestroy } from '@angular/core';
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- TOP ROW: Create Subject (70%) + Digital Clock (30%) -->
    <div class="top-row">
      <div class="create-subject-card">
        <h2>Create Subject</h2>
        <form [formGroup]="subjectForm" (ngSubmit)="createSubject()">
          <div class="form-group">
            <label for="name">Subject Name</label>
            <input type="text" id="name" formControlName="name" [class.error]="isFieldInvalid('name')" placeholder="e.g., Introduction to AI">
          </div>
          <div class="form-group">
            <label for="code">Subject Code</label>
            <input type="text" id="code" formControlName="code" [class.error]="isFieldInvalid('code')" placeholder="e.g., CS101">
          </div>
          <div class="message error" *ngIf="createSubjectError">{{ createSubjectError }}</div>
          <div class="message success" *ngIf="createSubjectSuccess">{{ createSubjectSuccess }}</div>
          <button type="submit" class="btn btn-primary" [disabled]="subjectForm.invalid || isCreatingSubject">
            {{ isCreatingSubject ? 'Creating...' : 'Create Subject' }}
          </button>
        </form>
      </div>
      <div class="clock-card">
        <div class="clock-content">
          <div class="clock-date">{{ currentDate }}</div>
          <div class="clock-time">{{ currentTime }}</div>
          <div class="clock-label">Local Time</div>
        </div>
      </div>
    </div>

    <!-- HEADER (Welcome) -->
    <header class="dashboard-header">
      <span class="welcome-text">Welcome, Professor {{ currentUser?.lastName }} (ID: {{ currentUser?.id }})</span>
      <button (click)="logout()" class="btn btn-secondary">Logout</button>
    </header>

    <!-- BOTTOM ROW: Subject Browser | Student Browser -->
    <div class="bottom-row">
      <!-- Subject Browser -->
      <div class="panel subject-browser">
        <h2>Subject Browser</h2>
        <form [formGroup]="searchForm" (ngSubmit)="searchSubjects()" class="subject-search-form">
          <div class="search-fields">
            <div class="form-group">
              <label for="searchSubjectId">Subject ID</label>
              <input type="number" id="searchSubjectId" formControlName="id" placeholder="ID">
            </div>
            <div class="form-group">
              <label for="searchSubjectCode">Subject Code</label>
              <input type="text" id="searchSubjectCode" formControlName="code" placeholder="Code">
            </div>
            <div class="form-group">
              <label for="searchSubjectName">Subject Name</label>
              <input type="text" id="searchSubjectName" formControlName="name" placeholder="Name">
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="isSearching">
              {{ isSearching ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </form>
        <div class="results-section" *ngIf="searchResults.length > 0">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let subject of searchResults">
                <td>{{ subject.code }}</td>
                <td>{{ subject.name }}</td>
                <td>
                  <button (click)="selectSubject(subject)" class="btn btn-secondary">Select</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="selected-subject" *ngIf="selectedSubject">
          <h3>{{ selectedSubject.name }} ({{ selectedSubject.code }})</h3>
          <div class="enrolled-students">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let student of enrolledStudents">
                  <td>{{ student.id }}</td>
                  <td>{{ student.firstName }} {{ student.lastName }}</td>
                  <td>
                    <button (click)="removeStudent(student.id)" class="btn btn-danger" [disabled]="isRemovingStudent === student.id">
                      {{ isRemovingStudent === student.id ? 'Removing...' : 'Remove' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <form [formGroup]="enrollForm" (ngSubmit)="enrollStudent()" class="enroll-form">
            <div class="form-group">
              <label for="enrollStudentId">Enroll Student by ID</label>
              <div class="input-with-button">
                <input type="number" id="enrollStudentId" formControlName="studentId" placeholder="Enter student ID">
                <button type="submit" class="btn btn-primary" [disabled]="enrollForm.invalid || isEnrolling">
                  {{ isEnrolling ? 'Enrolling...' : 'Enroll' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- Student Browser -->
      <div class="panel student-browser">
        <h2>Student Browser</h2>
        <form [formGroup]="studentSearchForm" (ngSubmit)="searchStudents()" class="student-search-form">
          <div class="search-fields">
            <div class="form-group">
              <label for="searchStudentId">Student ID</label>
              <input type="number" id="searchStudentId" formControlName="id" placeholder="ID">
            </div>
            <div class="form-group">
              <label for="searchStudentFirstName">First Name</label>
              <input type="text" id="searchStudentFirstName" formControlName="firstName" placeholder="First name">
            </div>
            <div class="form-group">
              <label for="searchStudentLastName">Last Name</label>
              <input type="text" id="searchStudentLastName" formControlName="lastName" placeholder="Last name">
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="isSearchingStudents">
              {{ isSearchingStudents ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </form>
        <div class="results-section" *ngIf="studentSearchResults.length > 0">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let student of studentSearchResults">
                <td>{{ student.id }}</td>
                <td>{{ student.firstName }} {{ student.lastName }}</td>
                <td>
                  <button (click)="selectStudent(student)" class="btn btn-secondary">Select</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="selected-student" *ngIf="selectedStudent">
          <div class="student-info">
            <h3>{{ selectedStudent.firstName }} {{ selectedStudent.lastName }}</h3>
            <p class="student-id">ID: {{ selectedStudent.id }}</p>
            <p class="average-grade" *ngIf="selectedStudentGrades.length > 0">
              Average Grade: {{ calculateAverageGrade() | number:'1.2-2' }}
            </p>
            <p class="no-grades" *ngIf="selectedStudentGrades.length === 0">
              No grades assigned yet
            </p>
          </div>
          <div class="student-subjects">
            <h4>Enrolled Subjects</h4>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Grade</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let subject of selectedStudentSubjects">
                  <td>{{ subject.name }}</td>
                  <td>
                    {{ getStudentGrade(subject.id) || 'No grade' }}
                  </td>
                  <td>
                    <button 
                      *ngIf="!hasGrade(subject.id)"
                      (click)="openGradeAssignment(subject.id)"
                      class="btn btn-secondary">
                      Assign Grade
                    </button>
                    <button 
                      *ngIf="hasGrade(subject.id)"
                      (click)="deleteGrade(getGradeId(subject.id))"
                      class="btn btn-danger"
                      [disabled]="isDeletingGrade === getGradeId(subject.id)">
                      {{ isDeletingGrade === getGradeId(subject.id) ? 'Deleting...' : 'Delete Grade' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Grade Assignment Dialog -->
    <div class="dialog-overlay" *ngIf="showGradeDialog" (click)="closeGradeDialog()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <h3>Assign Grade</h3>
        <form [formGroup]="gradeForm" (ngSubmit)="submitGrade()">
          <div class="form-group">
            <label for="grade">Grade (1.0 - 6.0)</label>
            <input 
              type="number" 
              id="grade" 
              formControlName="grade"
              min="1.0"
              max="6.0"
              step="0.1"
              [class.error]="gradeForm.get('grade')?.invalid && gradeForm.get('grade')?.touched"
            >
            <div class="message error" *ngIf="gradeForm.get('grade')?.invalid && gradeForm.get('grade')?.touched">
              Grade must be between 1.0 and 6.0
            </div>
          </div>
          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" (click)="closeGradeDialog()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="gradeForm.invalid || isAssigningGrade">
              {{ isAssigningGrade ? 'Assigning...' : 'Assign Grade' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      font-family: 'Inter', 'Open Sans', sans-serif;
      color: #2e3d2c;
      font-size: 16px;
      background-color: #f3f7f3;
      min-height: 100vh;
      display: block;
    }
    .top-row {
      display: flex;
      gap: 2rem;
      align-items: stretch;
      max-width: 1200px;
      margin: 2rem auto 0 auto;
    }
    .create-subject-card {
      flex: 0 1 70%;
      background: #f9f9f6;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(46, 125, 50, 0.07);
      padding: 2rem 2rem 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .clock-card {
      flex: 1 1 0;
      background: #f9f9f6;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(46, 125, 50, 0.07);
      padding: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 220px;
    }
    .clock-content {
      text-align: center;
      width: 100%;
    }
    .clock-date {
      font-size: 1.1rem;
      color: #61876E;
      margin-bottom: 1rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .clock-time {
      font-size: 2.8rem;
      font-family: 'Inter', monospace;
      color: #2e7d32;
      font-weight: 600;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
      line-height: 1.2;
    }
    .clock-label {
      font-size: 0.9rem;
      color: #61876E;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .dashboard-header {
      max-width: 1200px;
      margin: 1.5rem auto 2rem auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      background: #e0ede0;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(46, 125, 50, 0.04);
      border-bottom: 1px solid #e0e0e0;
      color: #2e7d32;
    }
    .welcome-text {
      font-size: 1.1rem;
      font-weight: 500;
    }
    .bottom-row {
      display: flex;
      gap: 2rem;
      align-items: flex-start;
      max-width: 1200px;
      margin: 0 auto 2rem auto;
    }
    .panel {
      background: #f9f9f6;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(46, 125, 50, 0.07);
      padding: 2rem 2rem 1.5rem 2rem;
      flex: 1 1 0;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: #2e7d32;
    }
    h3 {
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }
    .form-group {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
    }
    label {
      margin-bottom: 0.4rem;
      font-weight: 500;
      color: #333;
    }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.2s;
      background: #f9f9f6;
    }
    input:focus {
      outline: none;
      border-color: #2e7d32;
      box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.08);
    }
    input.error {
      border-color: #dc3545;
    }
    .search-fields {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      align-items: end;
      margin-bottom: 1.5rem;
    }
    .search-fields input {
      max-width: 180px;
      width: 100%;
    }
    .input-with-button {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .btn {
      padding: 0.7rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
      box-shadow: 0 1px 3px rgba(46, 125, 50, 0.04);
    }
    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .btn-primary {
      background: #2e7d32;
      color: white;
      border: 1.5px solid #1b5e20;
    }
    .btn-primary:hover:not(:disabled) {
      background: #1b5e20;
      border-color: #1b5e20;
    }
    .btn-secondary {
      background: #a5d6a7;
      color: #1b5e20;
    }
    .btn-secondary:hover:not(:disabled) {
      background: #81c784;
    }
    .btn-danger {
      background: #ffebee;
      color: #c62828;
    }
    .btn-danger:hover:not(:disabled) {
      background: #ffcdd2;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
      font-size: 0.98rem;
      background: #fff;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      font-weight: 600;
      color: #2e7d32;
      background: #f9f9f6;
    }
    tbody tr {
      transition: background-color 0.2s;
    }
    tbody tr:hover {
      background-color: #f5f5f0;
    }
    .message {
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.95rem;
    }
    .message.error {
      background: #ffebee;
      color: #c62828;
    }
    .message.success {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .student-info {
      background: #f9f9f6;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    .student-id {
      color: #666;
      font-size: 0.95rem;
    }
    .average-grade {
      font-weight: 500;
      color: #2e7d32;
      margin-top: 0.5rem;
    }
    .no-grades {
      color: #666;
      font-style: italic;
      margin-top: 0.5rem;
    }
    .results-section {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 1.5rem;
    }
    .selected-subject, .selected-student {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
    }
    .enroll-form {
      margin-top: 1.5rem;
    }
    .student-subjects {
      margin-top: 1.5rem;
    }
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .dialog {
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      h3 {
        margin-bottom: 1.5rem;
        color: #2e7d32;
      }
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }
  `]
})
export class TeacherDashboardComponent implements OnInit, OnDestroy {
  currentUser: UserDto | null = null;
  subjectForm: FormGroup;
  searchForm: FormGroup;
  enrollForm: FormGroup;
  studentSearchForm: FormGroup;
  studentGradeForm: FormGroup;
  
  // Subject management
  isCreatingSubject = false;
  createSubjectError = '';
  createSubjectSuccess = '';
  searchResults: Subject[] = [];
  selectedSubject: Subject | null = null;
  enrolledStudents: Student[] = [];

  // Student management
  studentSearchResults: Student[] = [];
  selectedStudent: Student | null = null;
  selectedStudentSubjects: Subject[] = [];
  selectedStudentGrades: any[] = [];
  
  // Loading states
  isSearching = false;
  isEnrolling = false;
  isLoadingStudents = false;
  isRemovingStudent: number | null = null;
  isSearchingStudents = false;
  isLoadingStudentGrades = false;
  isDeletingGrade: number | null = null;
  isAssigningGradeToStudent = false;
  
  // Messages
  searchError = '';
  enrollmentError = '';
  enrollmentSuccess = '';
  studentGradeError = '';
  studentGradeSuccess = '';

  showGradeDialog = false;
  selectedSubjectId: number | null = null;
  gradeForm: FormGroup;
  isAssigningGrade = false;

  currentTime: string = '';
  currentDate: string = '';
  private clockInterval: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private teacherService: TeacherService,
    private userService: UserService,
    private router: Router
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required]
    });

    this.searchForm = this.fb.group({
      id: [''],
      code: [''],
      name: ['']
    });

    this.enrollForm = this.fb.group({
      studentId: ['', [Validators.required, Validators.min(1)]]
    });

    this.studentSearchForm = this.fb.group({
      id: [''],
      firstName: [''],
      lastName: ['']
    });
    
    this.studentGradeForm = this.fb.group({
      subjectId: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(1.0), Validators.max(6.0)]]
    });

    this.gradeForm = this.fb.group({
      grade: ['', [Validators.required, Validators.min(1.0), Validators.max(6.0)]]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  updateClock(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
    this.currentDate = now.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    this.clearSubjectMessages();

    const request: CreateSubjectRequest = this.subjectForm.value;
    
    this.teacherService.createSubject(request).subscribe({
      next: (subject) => {
        this.createSubjectSuccess = `Subject "${subject.name}" created successfully!`;
        this.isCreatingSubject = false;
        this.subjectForm.reset();
      },
      error: (err) => {
        this.createSubjectError = err.error?.message || 'Failed to create subject.';
        this.isCreatingSubject = false;
      }
    });
  }

  searchSubjects(): void {
    const formValue = this.searchForm.value;
    const query: any = {};
    
    if (formValue.id) {
      query.id = formValue.id;
    } else if (formValue.code) {
      query.code = formValue.code;
    } else if (formValue.name) {
      query.name = formValue.name;
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
                   this.searchForm.get(fieldName) || 
                   this.enrollForm.get(fieldName) ||
                   this.studentSearchForm.get(fieldName) ||
                   this.studentGradeForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  searchStudents(): void {
    const formValue = this.studentSearchForm.value;
    const query: any = {};
    
    if (formValue.id) {
      query.id = formValue.id;
    } else if (formValue.firstName) {
      query.firstName = formValue.firstName;
    } else if (formValue.lastName) {
      query.lastName = formValue.lastName;
    } else {
      return; // Do not search if all fields are empty
    }

    this.isSearchingStudents = true;
    this.studentSearchResults = [];
    this.selectedStudent = null;
    this.clearStudentGradeMessages();

    this.teacherService.searchStudents(query).subscribe({
      next: (students) => {
        this.isSearchingStudents = false;
        this.studentSearchResults = students;
      },
      error: (err) => {
        this.isSearchingStudents = false;
        this.studentGradeError = 'Failed to search for students.';
      }
    });
  }

  selectStudent(student: Student): void {
    this.selectedStudent = student;
    this.studentSearchResults = [];
    this.studentSearchForm.reset();
    this.loadStudentData();
  }

  loadStudentData(): void {
    if (!this.selectedStudent) return;
    this.loadStudentSubjects();
    this.loadStudentGrades();
  }
  
  loadStudentSubjects(): void {
    if (!this.selectedStudent) return;
    this.teacherService.getStudentSubjects(this.selectedStudent.id).subscribe(subjects => {
      this.selectedStudentSubjects = subjects;
    });
  }
  
  loadStudentGrades(): void {
    if (!this.selectedStudent) return;
    this.isLoadingStudentGrades = true;
    this.clearStudentGradeMessages();
    this.teacherService.getStudentGrades(this.selectedStudent.id).subscribe({
      next: (grades) => {
        this.selectedStudentGrades = grades;
        this.isLoadingStudentGrades = false;
      },
      error: (err) => {
        this.studentGradeError = 'Failed to load student grades.';
        this.isLoadingStudentGrades = false;
      }
    });
  }
  
  assignGradeToStudent(): void {
    if (!this.selectedStudent || this.studentGradeForm.invalid) {
      return;
    }
    
    this.isAssigningGradeToStudent = true;
    this.clearStudentGradeMessages();
    
    const request: CreateGradeRequest = {
      studentId: this.selectedStudent.id,
      subjectId: this.studentGradeForm.value.subjectId,
      value: this.studentGradeForm.value.value,
    };
    
    this.teacherService.assignGrade(request).subscribe({
      next: () => {
        this.studentGradeSuccess = 'Grade assigned successfully.';
        this.isAssigningGradeToStudent = false;
        this.studentGradeForm.reset();
        this.loadStudentGrades();
      },
      error: (err) => {
        this.studentGradeError = err.error?.message || 'Failed to assign grade.';
        this.isAssigningGradeToStudent = false;
      }
    });
  }
  
  deleteGrade(gradeId: number | undefined): void {
    if (!gradeId) return;
    
    this.isDeletingGrade = gradeId;
    this.teacherService.deleteGrade(gradeId).subscribe({
      next: () => {
        this.loadStudentGrades();
        this.isDeletingGrade = null;
      },
      error: (error) => {
        console.error('Error deleting grade:', error);
        this.isDeletingGrade = null;
      }
    });
  }
  
  clearStudentGradeMessages(): void {
    this.studentGradeError = '';
    this.studentGradeSuccess = '';
  }

  clearSubjectMessages(): void {
    this.createSubjectError = '';
    this.createSubjectSuccess = '';
  }

  clearSearchMessages(): void {
    this.searchError = '';
  }

  calculateAverageGrade(): number {
    if (this.selectedStudentGrades.length === 0) return 0;
    const total = this.selectedStudentGrades.reduce((sum, grade) => sum + grade.value, 0);
    return total / this.selectedStudentGrades.length;
  }

  getStudentGrade(subjectId: number): number | undefined {
    return this.selectedStudentGrades.find(grade => grade.subject?.id === subjectId)?.value;
  }

  getGradeId(subjectId: number): number | undefined {
    return this.selectedStudentGrades.find(grade => grade.subject?.id === subjectId)?.id;
  }

  hasGrade(subjectId: number): boolean {
    return this.selectedStudentGrades.some(grade => grade.subject?.id === subjectId);
  }

  openGradeAssignment(subjectId: number): void {
    this.selectedSubjectId = subjectId;
    this.showGradeDialog = true;
  }

  closeGradeDialog(): void {
    this.showGradeDialog = false;
    this.selectedSubjectId = null;
    this.gradeForm.reset();
  }

  async submitGrade(): Promise<void> {
    if (this.gradeForm.invalid || !this.selectedSubjectId || !this.selectedStudent) return;

    this.isAssigningGrade = true;
    try {
      const request: CreateGradeRequest = {
        studentId: this.selectedStudent.id,
        subjectId: this.selectedSubjectId,
        value: this.gradeForm.value.grade
      };

      await this.teacherService.assignGrade(request).toPromise();
      await this.loadStudentGrades();
      this.closeGradeDialog();
    } catch (error) {
      console.error('Error assigning grade:', error);
    } finally {
      this.isAssigningGrade = false;
    }
  }
} 