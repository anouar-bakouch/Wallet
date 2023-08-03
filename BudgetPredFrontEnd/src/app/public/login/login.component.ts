import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from 'src/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

  export class LoginComponent {
  
    constructor(private loginService: LoginService) { }
  
    login(username: string, password: string): void {
      this.loginService.login(username, password).subscribe(
        (user: User) => {
          // Handle successful login
          console.log('Login successful', user);
          // Further actions (e.g., redirect to a different page)
        },
        (error) => {
          // Handle login error
          console.error('Login error', error);
        }
      );
    }
  }

