import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  login(): Observable<boolean> {
    // Simulating a login request
    return new Observable<boolean>((observer) => {
      // Perform the login logic here
      // Example:
      // if (username === 'admin' && password === 'password') {
      //   this.isAuthenticatedSubject.next(true);
      //   observer.next(true);
      // } else {
      //   observer.next(false);
      // }
      // observer.complete();
    });
  }

  logout(): void {
    // Perform the logout logic here
    // Example:
    // this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}