import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  private url:string = environment.apiUrl;

  constructor() { }

  login(username: string, password: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
        // TODO: call the API to authenticate the user
        // if the authentication is successful, call next() on the isAuthenticatedSubject
        // if the authentication fails, call error() with an appropriate error message

        

        
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