import { Component, OnInit } from '@angular/core';
import { SignupService } from '../services/sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {

  username: string="";
  email: string="";
  password: string="";
  firstName: string="";
  lastName: string="";

  constructor(private signupService: SignupService) {}

  ngOnInit() {}

  signup() {
    this.signupService.signup(this.username, this.email, this.password, this.firstName, this.lastName)
      .subscribe(
        (success) => {
          if (success) {
            // The user has successfully signed up.
          } else {
            // The signup failed.
          }
        },
        (error) => {
          // An error occurred while signing up.
        }
      );
  }

}