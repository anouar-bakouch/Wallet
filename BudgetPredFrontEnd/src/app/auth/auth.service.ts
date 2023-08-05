import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.http.post<any>(`${this.url}/login`, { username, password }).subscribe(
        (response) => {
          // Authentication successful
          const user = { id: response.id, username: response.username }; // Modify this based on your response structure
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
          observer.next(true);
          observer.complete();
        },
        (error) => {
          // Authentication failed
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
          observer.error('Authentication failed. Please check your credentials.');
        }
      );
    });
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
}