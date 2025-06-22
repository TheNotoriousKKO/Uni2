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
  indexNumber: string;
  username: string;
  email: string;
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
} 