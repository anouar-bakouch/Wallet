import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private url:string = environment.apiUrl;

  constructor(private http:HttpClient) { }

  public login(username:string, password:string){ 
    const url = `${environment.apiUrl}/SignIn/`;
    // create a json object that will be used to create a new user 
    const User = {
      username: username,
      password: password
    };

    console.log(User);

    return this.http.post(url, User);
    
  }

}
