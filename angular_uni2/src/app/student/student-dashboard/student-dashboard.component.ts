import { Component, OnInit, OnDestroy } from '@angular/core';
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- HEADER (Welcome) -->
    <header class="dashboard-header">
      <span class="welcome-text">Welcome, {{ currentUser?.firstName }} {{ currentUser?.lastName }} (ID: {{ currentUser?.id }})</span>
      <button (click)="logout()" class="btn btn-secondary">Logout</button>
    </header>

    <main class="dashboard-content">
      <div class="row row-top">
        <!-- Enrolled Subjects Card -->
        <div class="card enrolled-subjects-card">
          <h2>Your Enrolled Subjects</h2>
          <div class="table-container">
            <table *ngIf="subjects.length > 0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Teacher</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let subject of subjects">
                  <td>{{ subject.id }}</td>
                  <td>{{ subject.name }}</td>
                  <td>{{ subject.code }}</td>
                  <td>{{ subject.teacher?.firstName }} {{ subject.teacher?.lastName }}</td>
                </tr>
              </tbody>
            </table>
            <div class="empty-state" *ngIf="subjects.length === 0">
              <p>You are not enrolled in any subjects yet.</p>
            </div>
          </div>
        </div>
        <!-- Clock & Date Card -->
        <div class="card clock-card">
          <div class="clock-content">
            <div class="clock-date">{{ currentDate }}</div>
            <div class="clock-time">{{ currentTime }}</div>
            <div class="clock-label">Local Time</div>
          </div>
        </div>
      </div>
      <div class="row row-bottom">
        <!-- Average Grade Card -->
        <div class="card average-grade-card">
          <h2>Average Grade</h2>
          <div class="average-grade-content">
            <ng-container *ngIf="grades.length > 0; else noGrades">
              <div class="average-grade-value">{{ getAverageGrade() | number:'1.2-2' }}</div>
            </ng-container>
            <ng-template #noGrades>
              <div class="no-grades">No grades assigned yet.</div>
            </ng-template>
          </div>
        </div>
        <!-- Grades Table Card -->
        <div class="card grades-table-card">
          <h2>Your Grades</h2>
          <div class="table-container">
            <table *ngIf="grades.length > 0">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Grade</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let grade of grades">
                  <td>{{ grade.subject.name }}</td>
                  <td>
                    <span class="grade-value">{{ grade.value }}</span>
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
    .dashboard-header {
      max-width: 1200px;
      margin: 2rem auto 2rem auto;
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
    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }
    .row {
      display: flex;
      gap: 2rem;
      align-items: stretch;
      width: 100%;
    }
    .row-top .enrolled-subjects-card {
      flex: 0 1 70%;
    }
    .row-top .clock-card {
      flex: 1 1 0;
      min-width: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .row-bottom .average-grade-card {
      flex: 0 1 40%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #d2e6d2;
      color: #2e7d32;
      box-shadow: 0 2px 8px rgba(46, 125, 50, 0.08);
    }
    .row-bottom .grades-table-card {
      flex: 1 1 0;
    }
    .card {
      background: #f9f9f6;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(46, 125, 50, 0.07);
      padding: 2rem 2rem 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: #2e7d32;
    }
    .table-container {
      overflow-x: auto;
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
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #666;
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
    .average-grade-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 120px;
    }
    .average-grade-value {
      font-size: 3.2rem;
      font-weight: 700;
      color: #2e7d32;
      background: #fff;
      border-radius: 50%;
      width: 110px;
      height: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(46, 125, 50, 0.08);
      margin-bottom: 0.5rem;
    }
    .no-grades {
      color: #61876E;
      font-size: 1.1rem;
      font-style: italic;
      margin-top: 1.5rem;
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
  `]
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  currentUser: UserDto | null = null;
  subjects: Subject[] = [];
  grades: Grade[] = [];
  isLoading = false;
  errorMessage = '';
  currentTime: string = '';
  currentDate: string = '';
  private clockInterval: any;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadData();
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

  getAverageGrade(): number {
    if (!this.grades.length) return 0;
    const total = this.grades.reduce((sum, g) => sum + g.value, 0);
    return total / this.grades.length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
} 