import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
  private authService: AuthService,
  private router: Router) {}

  ngOnInit() {}

  login() {
    this.authService.login(this.username, this.password).subscribe((response) => {
      console.log(response)
      localStorage.setItem('token', response.access);
      this.router.navigate(['/home/budgets']);
    }, error => {
      console.log(error);
    }
    );
    

  }
}