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

  constructor(
    private router:Router,
    private authService:AuthService) { }

  ngOnInit() { }

  signup() {
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
    }
    );
  }
   
}