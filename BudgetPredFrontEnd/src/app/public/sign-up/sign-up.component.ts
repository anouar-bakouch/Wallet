import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {

  username: string = "";
  email: string = "";
  password: string = "";
  firstName: string = "";
  lastName: string = "";

  disabledSignupButton = true;
  emailError :string | null = null;
  passwordError :string | null = null;
  usernameError :string | null = null;
  firstNameError :string | null = null;
  lastNameError :string | null = null;
  showLoading = false;

  constructor(
    private router:Router,
    private authService:AuthService) { }

  ngOnInit() { }

  signup() {

    // TODO: Add validation

    // check email using regex
    const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
    if (!emailRegex.test(this.email)) {
      this.emailError = "Invalid email";
      return;
    }
    this.emailError = null;

    // check password length

    if (this.password.length < 8) {
      this.passwordError = "Password must be at least 8 characters long";
      return;
    }

    this.passwordError = null;

    // username must contain only letters and numbers
    const usernameRegex = new RegExp("^[a-zA-Z0-9]+$");
    if (!usernameRegex.test(this.username)) {
      this.usernameError = "Username must contain only letters and numbers";
      return;
    }
    this.usernameError = null;
    
    // first name must contain only letters
    const firstNameRegex = new RegExp("^[a-zA-Z]+$");
    if (!firstNameRegex.test(this.firstName)) {
      this.firstNameError = "First name must contain only letters";
      return;
    }

    this.firstNameError = null;

    // last name must contain only letters

    if (!firstNameRegex.test(this.lastName)) {
      this.lastNameError = "Last name must contain only letters";
      return;
    }

    this.lastNameError = null;

    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
      first_name: this.firstName,
      last_name: this.lastName,
      path_photo : "",
      month_budget : 0,
    }
    this.authService.signUp(user).subscribe((response) => {
      this.router.navigate(['/home/login']);
      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      localStorage.setItem('user_id', response.user_id);
      this.authService.refreshToken();

    }, error => {
      console.log(error);
    }, () => {
      console.log("complete");
    }
    );
  }

   
}