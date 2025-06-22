import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Subject {
  id: number;
  name: string;
  code: string;
  teacher?: {
    id: number;
    username: string;
    email: string;
  };
}

export interface Grade {
  id: number;
  value: number;
  dateAssigned: string;
  subject: {
    id: number;
    name: string;
    code: string;
  };
  student?: {
    id: number;
    indexNumber: string;
    username: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly API_URL = '/api/v1/student';

  constructor(private http: HttpClient) { }

  getEnrolledSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.API_URL}/subjects`);
  }

  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.API_URL}/grades`);
  }
} 