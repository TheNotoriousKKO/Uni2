import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDto {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'TEACHER';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = '/api/v1/auth';

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.API_URL}/me`);
  }
} 