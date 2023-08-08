import { Component, OnInit } from '@angular/core';
import { SignupService } from '../services/sign-up.service';
import { Router } from '@angular/router';

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

  constructor(private signupService: SignupService,private router:Router) { }

  ngOnInit() { }

  async signup() {
    try {
      const success = await this.signupService.signup(this.username, this.email, this.password, this.firstName, this.lastName).toPromise();
      if (success) {
        // The signup was successful.
        this.router.navigate(['/login']);        
      } else {
        // The signup failed.
        this.router.navigate(['/signup']);
      }
    } catch (error) {
      console.log(error);
    }
  }

   
}