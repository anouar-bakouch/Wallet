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
  showLoading: boolean = false;

  constructor(
  private authService: AuthService,
  private router: Router) {}

  ngOnInit() {}

  login() {
    this.showLoading = true;
    this.authService.login(this.username, this.password).subscribe((response) => {
      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      localStorage.setItem('user_id', response.user_id);
      this.authService.refreshToken();
      this.router.navigate(['/budgetHome/budgets']);
    }, error => {
      console.log(error);
    }, () => {
      this.showLoading = false;
    }
    );
    

  }
}