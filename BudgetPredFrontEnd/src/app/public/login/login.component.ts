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
  loginButtonDisabled: boolean = true;
  usernameError: string | null = null;
  passwordError: string | null = null;
  errorMessage: string | null = null;
  showErrorMessage: boolean = false;

  constructor(
  private authService: AuthService,
  private router: Router) {}

  ngOnInit() {}

  login() {
    this.showLoading = true;
    this.showErrorMessage = false;
    // Add validators to the username and password fields
    if (this.username === '') {
      this.usernameError = 'Username is required.';
    } else {
      this.usernameError = null;
    }

    if (this.password === '') {
      this.passwordError = 'Password is required.';
    } else {
      this.passwordError = null;
    }

    // Disable the login button if the username or password fields are empty
    this.loginButtonDisabled = this.username === '' || this.password === '';

    this.authService.login(this.username, this.password).subscribe((response) => {
      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      localStorage.setItem('user_id', response.user_id);
      this.authService.refreshToken();
      this.router.navigate(['/budgetHome/budgets']);
    }, error => {


      // for only 7 seconds
      setTimeout(() => {
        this.errorMessage = error.error.message;
        this.showErrorMessage = true;
        this.showLoading = false;

        // reset the form  
        this.username = '';
        this.password = '';
        this.loginButtonDisabled = true;        

      } , 3000);

      

    }, () => {
      this.showLoading = false;
      
    }
    );
    

  }
}