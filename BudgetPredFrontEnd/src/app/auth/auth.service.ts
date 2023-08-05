import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  private url: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.http.post<any>(`${this.url}/login`, { username, password }).subscribe(
        (response) => {
          // Authentication successful
          const user = { id: response.id, username: response.username }; // Modify this based on your response structure
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
          this.tokenStorage.storeTokens(response.token, response.refreshToken); // Store the tokens
          observer.next(true);
          observer.complete();
          this.router.navigate(['budgets/']); // Navigate to the dashboard after successful login
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
    this.clearCredentials();
    this.router.navigate(['/home/login']); // Navigate to the login page after logout
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    return new Observable<any>((observer) => {
      this.http.post<any>(`${this.url}/refresh`, { refreshToken }).subscribe(
        (response) => {
          this.tokenStorage.updateAuthToken(response.token); // Update the token
          observer.next(response.token);
          observer.complete();
        },
        (error) => {
          observer.error('Failed to refresh token');
        }
      );
    });
  }

  clearCredentials() {
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.tokenStorage.clearTokens();
  }
}