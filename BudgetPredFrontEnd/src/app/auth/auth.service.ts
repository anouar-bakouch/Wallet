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
  ) {
    const storedUser = this.tokenStorage.getUser();
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.http.post<any>(`${this.url}/api/token/`, { username, password }).subscribe(
        (response: any) => {
          const user = { id: response.user_id, username: response.username };
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
          this.tokenStorage.storeTokens(response.access, response.refresh);
          this.tokenStorage.storeUser(user);
          observer.next(true);
          observer.complete();
        },
        (error) => {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
          console.log(error);
          observer.error('Authentication failed. Please check your credentials.');
        }
      );
    });
  }

  logout(): void {
    this.clearCredentials();
    this.router.navigate(['/home/login']);
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
      this.http.post<any>(`${this.url}/api/token/refresh/`, { refresh: refreshToken }).subscribe(
        (response: any) => {
          this.tokenStorage.updateAuthToken(response.access);
          observer.next(response.access);
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