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
    return this.http.post<any>(this.url+"/login", {username, password});
  }

}
