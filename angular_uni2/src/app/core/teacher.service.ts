import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateSubjectRequest {
  name: string;
  code: string;
}

export interface CreateGradeRequest {
  studentId: number;
  subjectId: number;
  value: number;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
}

export interface Grade {
  id: number;
  value: number;
  dateAssigned: string;
  subject?: Subject;
}

export interface Student {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

export interface SubjectSearchQuery {
  id?: number;
  code?: string;
  name?: string;
}

export interface StudentSearchQuery {
  id?: number;
  firstName?: string;
  lastName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private readonly API_URL = '/api/v1/teacher';

  constructor(private http: HttpClient) { }

  createSubject(request: CreateSubjectRequest): Observable<Subject> {
    return this.http.post<Subject>(`${this.API_URL}/subjects`, request);
  }

  assignGrade(request: CreateGradeRequest): Observable<Grade> {
    return this.http.post<Grade>(`${this.API_URL}/grades`, request);
  }

  deleteGrade(gradeId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/grades/${gradeId}`);
  }

  searchSubjects(query: SubjectSearchQuery): Observable<Subject[]> {
    let params = '';
    if (query.id) {
      params = `?id=${query.id}`;
    } else if (query.code) {
      params = `?code=${query.code}`;
    } else if (query.name) {
      params = `?name=${encodeURIComponent(query.name)}`;
    }
    return this.http.get<Subject[]>(`${this.API_URL}/subjects/search${params}`);
  }

  searchStudents(query: StudentSearchQuery): Observable<Student[]> {
    let params = '';
    if (query.id) {
      params = `?id=${query.id}`;
    } else if (query.firstName) {
      params = `?firstName=${encodeURIComponent(query.firstName)}`;
    } else if (query.lastName) {
      params = `?lastName=${encodeURIComponent(query.lastName)}`;
    }
    return this.http.get<Student[]>(`${this.API_URL}/students/search${params}`);
  }

  getStudentSubjects(studentId: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.API_URL}/students/${studentId}/subjects`);
  }

  getStudentGrades(studentId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.API_URL}/students/${studentId}/grades`);
  }

  getEnrolledStudents(subjectId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.API_URL}/subjects/${subjectId}/students`);
  }

  enrollStudent(subjectId: number, studentId: number): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/subjects/${subjectId}/students/${studentId}`, {});
  }

  removeStudent(subjectId: number, studentId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/subjects/${subjectId}/students/${studentId}`);
  }
} 