import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SignupService {

  constructor(private http: HttpClient) {}

  signup(username: string, email: string, password: string, firstName: string, lastName: string): Observable<any> {
    

      const url = `${environment.apiUrl}/SignUp/`;
    // create a json object that will be used to create a new user 
    const User = {
      username: username,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    };

    return this.http.post(url, User);
    
  }
  }


