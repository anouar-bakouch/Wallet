import { Component, OnInit} from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  username: string="";
  password: string="";

  constructor(private loginService: LoginService,private router:Router) {}

  ngOnInit() {}

  login() {
    this.loginService.login(this.username, this.password)
      .subscribe(
        (success) => {
          if (success) {
            this.router.navigate(['/budgets']);
          } else {
            this.router.navigate(['/login']);
          }
        },
        (error) => {
          // An error occurred while logging in.
        }
      );
  }

}
