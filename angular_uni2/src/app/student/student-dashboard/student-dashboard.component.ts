import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { StudentService, Subject, Grade } from '../../core/student.service';
import { UserService, UserDto } from '../../core/user.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Student Dashboard</h1>
        <div class="user-info">
          <span>Welcome, {{ currentUser?.firstName }} {{ currentUser?.lastName }} (ID: {{ currentUser?.id }})</span>
          <button (click)="logout()" class="btn btn-secondary">Logout</button>
        </div>
      </header>
      
      <main class="dashboard-content">
        <div class="loading-container" *ngIf="isLoading">
          <div class="loading-spinner"></div>
          <p>Loading your data...</p>
        </div>

        <div class="error-container" *ngIf="errorMessage">
          <div class="error-message">
            <h3>Error</h3>
            <p>{{ errorMessage }}</p>
            <button (click)="loadData()" class="btn btn-primary">Retry</button>
          </div>
        </div>

        <div class="dashboard-grid" *ngIf="!isLoading && !errorMessage">
          <!-- Enrolled Subjects Section -->
          <div class="dashboard-card">
            <h2>Enrolled Subjects</h2>
            <div class="table-container">
              <table class="data-table" *ngIf="subjects.length > 0">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let subject of subjects">
                    <td>{{ subject.code }}</td>
                    <td>{{ subject.name }}</td>
                    <td>{{ subject.teacher?.username || 'Not assigned' }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="empty-state" *ngIf="subjects.length === 0">
                <p>You are not enrolled in any subjects yet.</p>
              </div>
            </div>
          </div>

          <!-- Grades Section -->
          <div class="dashboard-card">
            <h2>Your Grades</h2>
            <div class="table-container">
              <table class="data-table" *ngIf="grades.length > 0">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Grade</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let grade of grades">
                    <td>{{ grade.subject.name }} ({{ grade.subject.code }})</td>
                    <td>
                      <span class="grade-value" [class]="getGradeClass(grade.value)">
                        {{ grade.value }}
                      </span>
                    </td>
                    <td>{{ formatDate(grade.dateAssigned) }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="empty-state" *ngIf="grades.length === 0">
                <p>No grades have been assigned yet.</p>
              </div>
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
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

    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .error-message {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 500px;
    }

    .error-message h3 {
      color: #dc3545;
      margin-bottom: 1rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
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

    .grade-value {
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .grade-value.excellent {
      background-color: #d4edda;
      color: #155724;
    }

    .grade-value.good {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .grade-value.average {
      background-color: #fff3cd;
      color: #856404;
    }

    .grade-value.poor {
      background-color: #f8d7da;
      color: #721c24;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
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
export class StudentDashboardComponent implements OnInit {
  currentUser: UserDto | null = null;
  subjects: Subject[] = [];
  grades: Grade[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadData();
  }

  loadUserData(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.errorMessage = 'Failed to load user information';
      }
    });
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Load subjects and grades in parallel
    Promise.all([
      this.studentService.getEnrolledSubjects().toPromise(),
      this.studentService.getGrades().toPromise()
    ]).then(([subjects, grades]) => {
      this.subjects = subjects || [];
      this.grades = grades || [];
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading data:', error);
      this.errorMessage = 'Failed to load data. Please try again.';
      this.isLoading = false;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getGradeClass(value: number): string {
    if (value >= 5.0) return 'excellent';
    if (value >= 4.0) return 'good';
    if (value >= 3.0) return 'average';
    return 'poor';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
} 