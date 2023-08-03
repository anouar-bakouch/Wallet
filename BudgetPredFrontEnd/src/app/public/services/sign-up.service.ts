import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) {}

  signup(username: string, email: string, password: string, firstName: string, lastName: string) {
    const url = environment.apiUrl+'/signup';
    const body = {
      username: username,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    };
    return this.http.post(url, body);
  }

}
