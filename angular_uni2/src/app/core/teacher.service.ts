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