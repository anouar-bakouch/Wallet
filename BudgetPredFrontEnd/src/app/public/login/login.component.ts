import { Component, OnInit} from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";

  constructor(private signinService: LoginService,private router:Router) { }

  ngOnInit() { }

  async login() {
    try {
      const success = await this.signinService.login(this.username, this.password).toPromise();
      console.log(success)
      if (success) {
        this.router.navigate(['budgetHome/budgets']);

      } else {
        // The signup failed.
        this.router.navigate(['/home/signup']);
      }
    } catch (error) {
      console.log(error);
    }
  }
}