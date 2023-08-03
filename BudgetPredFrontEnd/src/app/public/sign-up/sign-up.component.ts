import { Component, OnInit } from '@angular/core';
import { SignupService } from '../services/sign-up.service';

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

  constructor(private signupService: SignupService) { }

  ngOnInit() { }

  async signup() {
    try {
      const success = await this.signupService.signup(this.username, this.email, this.password, this.firstName, this.lastName).toPromise();
      if (success) {
        console.log("The signup was successful.")
      } else {
        // The signup failed.
      }
    } catch (error) {
      console.log(error);
    }
  }
}