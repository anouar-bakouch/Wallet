import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Token } from 'src/models/Token';
import { User } from 'src/models/User';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private url: string = environment.apiUrl;
  isLogged: any;
  private token:string = "";
  private refreshTokenTimeout: any;
  private id: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

  }

  login(username:string,password:string): Observable<any> {
    return this.http.post<Token>(`${this.url}/auth/login`, {
      username,
      password
    });
  }

  logout() {
    this.token = "";
    this.id = 0;
    localStorage.removeItem('access');
    localStorage.removeItem('user_id');
    localStorage.removeItem('refresh');
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
    this.router.navigate(['/login']);
  }

  refreshToken() {
    return this.http.post<Token>(`${this.url}/auth/refresh`, {
      refreshToken: this.getRefreshToken()
    }).subscribe((response) => {
      this.token = response.access;
      localStorage.setItem('access', response.access);
      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshToken();
      }, 10000);
    });
  }

  getRefreshToken() {
    return localStorage.getItem('refresh');
  }

  getToken() {
    return localStorage.getItem('access');
  }

  getId() {
    return localStorage.getItem('user_id');
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  logOut() {
    localStorage.removeItem('access');
    localStorage.removeItem('user_id');
    localStorage.removeItem('refresh');
    this.router.navigate(['/login']);
  }

  signUp(user:any): Observable<any> {
    return this.http.post<User>(`${this.url}/register/`, user);
  }
    
  }



