import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  signup(username: string, email: string, password: string, firstName: string, lastName: string): Observable<any> {
    const url = `${environment.apiUrl}/register/candidat/`;
    const payload = {
      username: username,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    };

    this.authService.clearCredentials();

    return new Observable<any>((observer) => {
      this.http.post(url, payload).subscribe(
        (response) => {
          observer.next('Account created successfully');
          observer.complete();
        },
        (error) => {
          observer.error('An error occurred');
        }
      );
    });
  }
}